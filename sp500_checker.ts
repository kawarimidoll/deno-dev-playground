import { DOMParser, ky, TextDB } from "./deps.ts";
import { LINE_ACCESS_TOKEN, TEXTDB_UUID } from "./env.ts";
import { lineNotify } from "./line_notify.ts";

const url = "https://www.spglobal.com/spdji/en/indices/equity/sp-500/#overview";
const html = await ky(url).text();
const dom = new DOMParser().parseFromString(html, "text/html");

if (!dom) {
  throw new Error("DOM parse failed");
}

const element = dom.getElementsByClassName("published-value")[0];
const currentPrice = Number(element?.innerText.replaceAll(",", "")) || 0;
if (!currentPrice) {
  throw new Error("Failed to get data");
}

const db = new TextDB(TEXTDB_UUID);
const data = JSON.parse(await db.get() ?? "");
const lastPrice = data?.sp500 || 0;

console.log({ currentPrice, lastPrice });

const down = Math.round(10000 * (lastPrice - currentPrice) / lastPrice) / 100;

if (down > 5) {
  console.log("heavy down is detected");
  console.log(
    await lineNotify({
      message: `S&P価格情報：先週より${down}%の下落が発生しました。`,
      token: LINE_ACCESS_TOKEN,
    }),
  );
}

data.sp500 = currentPrice;
await db.put(JSON.stringify(data));

console.log("process finished successfully");
