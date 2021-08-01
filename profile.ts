import { tag as h } from "https://deno.land/x/markup_tag@0.1.2/mod.ts";
import { serve } from "https://deno.land/std@0.103.0/http/server.ts";
import { createDeploySource } from "./create_deploy_source.ts";
import { parse as parseYAML } from "https://deno.land/std@0.103.0/encoding/yaml.ts";

const css = (cssObject: Record<string, Record<string, unknown>>) =>
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
  bio: string;
  avatar: string;
  favicon: string;
  list: {
    [key: string]: ListGroup;
  };
}
const {
  name,
  bio,
  avatar,
  favicon,
  list,
} = parseYAML(Deno.readTextFileSync("./config.yml")) as ProfileConfiguration;

const title = "kawarimidoll profile";
const styles = css({
  body: {
    display: "flex",
    "justify-content": "center",
    margin: "0",
    "text-align": "center",
    "scroll-behavior": "smooth",
    "font-family": "sans-serif,monospace",
  },
  a: { "text-decoration": "none", color: "inherit" },
  h2: {
    "margin-block-start": "-2rem",
    "margin-block-end": "0",
    "padding-top": "4rem",
  },
  img: { display: "block", margin: "0 auto" },
  "#main": { width: "100%", "max-width": "800px", padding: "1rem 0.5rem" },
  ".avatar": { "border-radius": "50%", width: "260px", height: "auto" },
  ".list-group": { "max-width": "500px", margin: "0 auto" },
  ".list-item": {
    "border-radius": "5px",
    "border-style": "solid",
    "border-width": "thin",
    margin: "0.5rem auto",
    padding: "0.5rem 2rem",
  },
  ".nav-box": {
    "background-color": "#fff",
    position: "sticky",
    top: "0",
    "border-bottom": "1px solid #222",
  },
  ".nav": {
    display: "flex",
    "justify-content": "space-around",
    margin: "0 auto",
    padding: "0.5rem",
    width: "100%",
    "max-width": "300px",
  },
  ".nav>a": {
    display: "block",
  },
  ".inline": {
    display: "inline",
  },
});

const icongram = (name: string, size = 20, attrs = {}) =>
  h("img", {
    src: `https://icongr.am/${
      name.replace(/(^[^\/]*$)/, "feather/$1")
    }.svg?size=${size}`,
    alt: name,
    ...attrs,
  });

const exLink = icongram("external-link", 12, { class: "inline" });

const iconText = (icon: string, text: string) =>
  h("div", { class: "list-item" }, icongram(icon), h("div", text));

const iconLink = (icon: string, text: string, href: string) =>
  h("a", { href }, iconText(icon, text + " " + exLink));

const html = "<!DOCTYPE html>" +
  h(
    "html",
    h(
      "head",
      { prefix: "og:http://ogp.me/ns#" },
      h("meta", { charset: "utf-8" }),
      h("meta", {
        name: "viewport",
        content: "width=device-width,initial-scale=1.0",
      }),
      h("meta", {
        property: "og:url",
        content: "https://kawarimidoll.deno.dev",
      }),
      h("meta", { property: "og:type", content: "website" }),
      h("meta", { property: "og:title", content: title }),
      h("meta", { property: "og:description", content: "About kawarimidoll" }),
      h("meta", { property: "og:site_name", content: title }),
      h("meta", { property: "og:image", content: avatar }),
      h("meta", { name: "twitter:card", content: "summary" }),
      h("meta", { name: "twitter:site", content: "@kawarimidoll" }),
      h("title", title),
      h("style", styles),
      h("link", { rel: "icon", type: "image/svg+xml", href: favicon }),
    ),
    h(
      "body",
      h(
        "div",
        { id: "main" },
        h("img", { alt: "avatar", class: "avatar", src: avatar }),
        h("h1", name),
        h("div", { style: "margin-bottom:2rem" }, bio),
        h("div", "Click to jump..."),
        h(
          "div",
          { class: "nav-box" },
          h(
            "div",
            { class: "nav" },
            ...Object.entries(list).map(([id, listGroup]) => {
              return h("a", { href: `#${id}` }, icongram(listGroup.icon, 26));
            }),
          ),
        ),
        h(
          "div",
          { class: "list-group" },
          ...Object.entries(list).map(([id, listGroup]) => {
            const { icon, items } = listGroup;
            return h("h2", { id }, icongram(icon, 40)) +
              items.map((listItem) =>
                listItem.url
                  ? iconLink(listItem.icon, listItem.text, listItem.url)
                  : iconText(listItem.icon, listItem.text)
              ).join("");
          }),
        ),
      ),
    ),
  );

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
