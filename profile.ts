import { NBSP, tag as h } from "https://deno.land/x/markup_tag@0.1.2/mod.ts";

const css = (cssObject: Record<string, Record<string, unknown>>) =>
  Object.entries(cssObject).map(([selector, attributes]) =>
    selector + "{" +
    Object.entries(attributes).map(([k, v]) => `${k}:${v}`).join(";") +
    "}"
  ).join("");

const title = "kawarimidoll";
const styles = css({
  "body": { display: "flex", "justify-content": "center" },
  ".avatar": { "border-radius": "50%" },
});

const html = "<!DOCTYPE html>" +
  h(
    "html",
    h(
      "head",
      h("meta", { charset: "utf-8" }),
      h("title", title),
      h("style", styles),
      h("link", {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css",
        integrity:
          "sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==",
        crossorigin: "anonymous",
        referrerpolicy: "no-referrer",
      }),
      // h("link", {
      //   href:
      //     "https://cdn.jsdelivr.net/gh/lucaburgio/iconoir@4.4/css/iconoir.css",
      //   rel: "stylesheet",
      //   type: "text/css",
      // }),
      h("link", {
        href:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.12.0/devicon.min.css",
        rel: "stylesheet",
        type: "text/css",
      }),
      h("link", {
        rel: "icon",
        type: "image/svg+xml",
        href:
          "https://raw.githubusercontent.com/kawarimidoll/kawarimidoll/master/assets/kawarimi_chip_icon.svg",
      }),
    ),
    h(
      "body",
      h(
        "div",
        { id: "main" },
        h("img", {
          style: "height:auto;",
          alt: "avatar",
          width: "260",
          height: "260",
          class: "avatar",
          src: "https://avatars.githubusercontent.com/u/8146876?v=4",
        }),
        h("h1", "kawarimidoll"),
        h("hr"),
        h("h2", "I am..."),
        h("div", "Software developer"),
        h("div", "Yak shaver"),
        h("div", "Wheel reinventor"),
        h(
          "div",
          h("i", { class: "fas fa-map-marker-alt" }),
          NBSP,
          "in the Room 101, Japan",
        ),
        h("hr"),
        h("h2", "I am using..."),
        h(
          "div",
          h("i", { class: "devicon-apple-original" }),
          NBSP,
          "macOS",
        ),
        h(
          "div",
          h("i", { class: "devicon-vim-plain" }),
          NBSP,
          "Neovim",
        ),
        h("hr"),
        h("h2", "links"),
        h(
          "div",
          h("i", { class: "fab fa-twitter" }),
          NBSP,
          h("a", { href: "https://twitter.com/kawarimidoll" }, "Twitter"),
        ),
        h(
          "div",
          h("i", { class: "fab fa-github" }),
          NBSP,
          h("a", { href: "https://github.com/kawarimidoll" }, "GitHub"),
        ),
        h(
          "div",
          h("i", { class: "fas fa-kiwi-bird" }),
          NBSP,
          h("a", { href: "https://pixe.la/@kawarimidoll" }, "Pixela"),
        ),
        h(
          "div",
          h("i", { class: "far fa-newspaper" }),
          NBSP,
          h("a", { href: "https://zenn.dev/kawarimidoll" }, "Zenn"),
        ),
        h(
          "div",
          h("i", { class: "fas fa-search" }),
          NBSP,
          h("a", { href: "https://qiita.com/kawarimidoll" }, "Qiita"),
        ),
      ),
    ),
  );
// await Deno.writeTextFile("index.html", html);
// console.log("Done");

// addEventListener("fetch", (event: FetchEvent) => {
//   const response = new Response(html, {
//     headers: { "content-type": "text/html" },
//   });
//   event.respondWith(response);
// });

const port = 8080;
const server = Deno.listen({ port });
console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);
for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      requestEvent.respondWith(
        new Response(html, {
          status: 200,
          headers: { "content-type": "text/html" },
        }),
      );
    }
  })();
}
