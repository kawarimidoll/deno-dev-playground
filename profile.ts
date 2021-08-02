import { tag as h } from "https://deno.land/x/markup_tag@0.1.2/mod.ts";
import { serve } from "https://deno.land/std@0.103.0/http/server.ts";
import { createDeploySource } from "./create_deploy_source.ts";
import { parse as parseYaml } from "https://deno.land/std@0.103.0/encoding/yaml.ts";

import shuffle from "https://deno.land/x/shuffle@v1.0.0/mod.ts";
import { range } from "https://deno.land/x/it_range@v1.0.2/mod.ts";

interface CssObject {
  [key: string]: { [key: string]: unknown };
}
const css = (cssObject: CssObject) =>
  Object.entries(cssObject).map(([selector, attributes]) =>
    selector + "{" +
    Object.entries(attributes).map(([k, v]) => `${k}:${v}`).join(";") +
    "}"
  ).join("");

interface ListGroup {
  icon: string;
  items: ListItem[];
}
interface ListItem {
  text: string;
  icon: string;
  url?: string;
}
interface ProfileConfiguration {
  name: string;
  projectName: string;
  title?: string;
  bio?: string;
  avatar: string;
  favicon?: string;
  twitter?: string;
  list: {
    [key: string]: ListGroup;
  };
}
const {
  name,
  projectName,
  title: titleInConfig,
  bio,
  avatar,
  favicon,
  twitter: twitterInConfig,
  list: listInConfig,
} = parseYaml(Deno.readTextFileSync("./config.yml")) as ProfileConfiguration;

// TODO: validate with custom schema
if (!name || !projectName || !avatar || !listInConfig) {
  throw new Error("missing required data");
}

const title = titleInConfig || `${name} profile`;
const twitter = (twitterInConfig || "").replace(/^([^@])/, "@$1");
const list = Object.entries(listInConfig);
if (list.length === 0) {
  throw new Error("list item is empty");
}

const icongram = (name: string, size = 20, attrs = {}) =>
  h("img", {
    src: `https://icongr.am/${
      name.replace(/(^[^\/]*$)/, "feather/$1")
    }.svg?size=${size}&color=ffffff`,
    alt: name,
    ...attrs,
  });

const renderListItem = (listItem: ListItem) => {
  const exLink = icongram("external-link", 12, { class: "inline" });
  const { icon, text, url: href } = listItem;

  const iconText = (icon: string, text: string) =>
    h("div", { class: "list-item" }, icongram(icon), h("div", text));

  return href
    ? h("a", { href }, iconText(icon, text + " " + exLink))
    : iconText(icon, text);
};

const cssObject = parseYaml(Deno.readTextFileSync("./style.yml")) as CssObject;
const styles = css(cssObject);
const rainCount = 30;
const getRandomInt = (max: number) => Math.floor(Math.random() * max);
const delays: CssObject = {};
shuffle([...range(rainCount)]).forEach((num: number, idx) => {
  delays[`.drop:nth-child(${idx})`] = {
    "animation-delay": `${num * 100}ms`,
    "animation-duration": `${getRandomInt(250) + 375}ms`,
  };
});

const rainStyle = css({
  ".rain": {
    "user-select": "none",
    "pointer-events": "none",
    "z-index": 1,
    position: "fixed",
    width: "100%",
    height: "100%",
    display: "flex",
    "justify-content": "space-around",
    transform: "rotate(10deg)",
  },
  ".drop": {
    width: "1px",
    height: "10vh",
    background: "#fff",
    opacity: 0.4,
    animation: "falldown 1s infinite",
    "margin-top": "-20vh",
    "animation-timing-function": "linear",
  },
}) + css(delays) +
  `@keyframes falldown{ to{ margin-top: 120vh } }`;

const htmlHead = h(
  "head",
  { prefix: "og:http://ogp.me/ns#" },
  h("meta", { charset: "utf-8" }),
  h("meta", {
    name: "viewport",
    content: "width=device-width,initial-scale=1.0",
  }),
  h("meta", { property: "og:url", content: `https://${projectName}.deno.dev` }),
  h("meta", { property: "og:type", content: "website" }),
  h("meta", { property: "og:title", content: title }),
  h("meta", { property: "og:description", content: `About ${name}` }),
  h("meta", { property: "og:site_name", content: title }),
  h("meta", { property: "og:image", content: avatar }),
  h("meta", { name: "twitter:card", content: "summary" }),
  twitter ? h("meta", { name: "twitter:site", content: twitter }) : "",
  h("title", title),
  h("style", styles),
  h("style", rainStyle),
  favicon ? h("link", { rel: "icon", href: favicon }) : "",
);

const htmlBody = h(
  "body",
  h("div", { class: "rain" }, h("div", { class: "drop" }).repeat(rainCount)),
  h(
    "div",
    { id: "main" },
    h("img", { alt: "avatar", class: "avatar", src: avatar }),
    h("h1", name),
    bio ? h("div", { class: "bio" }, bio) : "",
    h("div", "Click to jump..."),
    h(
      "div",
      { class: "nav-box" },
      h(
        "div",
        { class: "nav" },
        ...list.map(([id, listGroup]) =>
          h("a", { href: `#${id}` }, icongram(listGroup.icon, 26))
        ),
      ),
    ),
    h(
      "div",
      { class: "list-group" },
      ...list.map(([id, listGroup]) => {
        const { icon, items } = listGroup;
        return h("h2", { id }, icongram(icon, 40)) +
          items.map((listItem) => renderListItem(listItem)).join("");
      }),
    ),
    h("div", "Powered by deno deploy"),
  ),
);

const html = "<!DOCTYPE html>" + h("html", htmlHead, htmlBody);

if (Deno.args.includes("--build") || Deno.args.includes("-b")) {
  Deno.writeTextFileSync("./server.js", createDeploySource(html));
  Deno.exit(0);
}

const port = 8080;
const server = serve({ port });
console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);
for await (const request of server) {
  const headers = new Headers({ "content-type": "text/html" });
  request.respond({ status: 200, body: html, headers });
}
