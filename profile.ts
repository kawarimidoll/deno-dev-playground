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
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/cpu.svg?size=18" }),
          NBSP,
          "Software developer",
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/scissors.svg?size=18" }),
          NBSP,
          "Yak shaver",
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/life-buoy.svg?size=18" }),
          NBSP,
          "Wheel reinventor",
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/triangle.svg?size=18" }),
          NBSP,
          "Indoor climber",
        ),
        h(
          "div",
          h("img", {
            src: "https://icongr.am/feather/trending-up.svg?size=18",
          }),
          NBSP,
          "Long-term investor",
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/map-pin.svg?size=18" }),
          NBSP,
          "in the Room 101, Japan",
        ),
        h("hr"),
        h("h2", "I am using..."),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/monitor.svg?size=18" }),
          NBSP,
          "macOS",
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/smartphone.svg?size=18" }),
          NBSP,
          "iPhone",
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/terminal.svg?size=18" }),
          NBSP,
          "Neovim",
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/heart.svg?size=18" }),
          NBSP,
          "Deno",
        ),
        h("hr"),
        h("h2", "links"),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/twitter.svg?size=18" }),
          NBSP,
          h("a", { href: "https://twitter.com/kawarimidoll" }, "Twitter"),
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/github.svg?size=18" }),
          NBSP,
          h("a", { href: "https://github.com/kawarimidoll" }, "GitHub"),
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/grid.svg?size=18" }),
          NBSP,
          h("a", { href: "https://pixe.la/@kawarimidoll" }, "Pixela"),
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/book.svg?size=18" }),
          NBSP,
          h("a", { href: "https://zenn.dev/kawarimidoll" }, "Zenn"),
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/search.svg?size=18" }),
          NBSP,
          h("a", { href: "https://qiita.com/kawarimidoll" }, "Qiita"),
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/coffee.svg?size=18" }),
          NBSP,
          h(
            "a",
            { href: "https://www.buymeacoffee.com/kawarimidoll" },
            "Buy me a coffee",
          ),
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/gitlab.svg?size=18" }),
          NBSP,
          h(
            "a",
            { href: "https://gitlab.com/kawarimidoll" },
            "GitLab [stale]",
          ),
        ),
        h(
          "div",
          h("img", { src: "https://icongr.am/feather/package.svg?size=18" }),
          NBSP,
          h(
            "a",
            { href: "https://www.npmjs.com/~kawarimidoll" },
            "npm [stale]",
          ),
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