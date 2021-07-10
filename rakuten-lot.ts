import puppeteer, { Page } from "https://deno.land/x/puppeteer@9.0.1/mod.ts";

import { DOMParser, ky } from "./deps.ts";
import { RAKUTEN_MAIL, RAKUTEN_PASS } from "./env.ts";
import { iso8601 } from "./utils.ts";

const timestamp = () => iso8601(new Date());
const log = (...msg: string[]) => console.log(timestamp(), "INFO", ...msg);
const warn = (...msg: string[]) => console.warn(timestamp(), "WARN", ...msg);

const html = await ky("https://rakucoin.appspot.com/rakuten/kuji/").text();
const dom = new DOMParser().parseFromString(html, "text/html");

if (!dom) {
  throw new Error("parse failed");
}

async function elementInPage(
  page: Page,
  selector: string,
  timeout = 5000,
): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { visible: true, timeout });
    return true;
  } catch {
    return false;
  }
}

async function playLot(page: Page, link = ""): Promise<void> {
  if (!link) {
    return;
  }
  log(`play ${link}`);
  await page.goto(link);

  if (/grp0\d\.id/.test(page.url())) {
    log("sign in...");

    if (await elementInPage(page, "#loginInner_u")) {
      await page.type("#loginInner_u", RAKUTEN_MAIL);
      await page.type("#loginInner_p", RAKUTEN_PASS);
      await page.click('input[type="submit"]');
    } else {
      await page.type("#username", RAKUTEN_MAIL);
      await page.type("#password", RAKUTEN_PASS);
      await page.click('button[type="submit"]');
    }
  }

  await page.waitForSelector("body", { visible: true, timeout: 5000 });

  if (page.url().endsWith("already")) {
    log("already played");
    return;
  }

  if (!(await elementInPage(page, "#entry"))) {
    log("there is no #entry element in the page.");
    return;
  }

  log("playing");
  await page.click("#entry");
  log("wait...");
  await page.waitForTimeout(16000);
  log("play finished");
}

log("start rakuten-lot");
// const browser = await puppeteer.launch({ headless: false });
const browser = await puppeteer.launch();
const page = await browser.newPage();
log("puppeteer launched");

const tables = dom.getElementsByTagName("table");

for (const idx of [0, 1]) {
  if (idx === 1) {
    await page.emulate(puppeteer.devices["iPhone 11"]);
  }

  for (const link of tables[idx].getElementsByTagName("a")) {
    try {
      await playLot(page, link.getAttribute("href") || "");
    } catch (e) {
      warn(e);
    }
  }
}

await browser.close();
log("finish rakuten-lot");
