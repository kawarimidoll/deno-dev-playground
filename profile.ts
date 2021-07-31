import { NBSP, tag as h } from "https://deno.land/x/markup_tag@0.1.2/mod.ts";

const css = (cssObject: Record<string, Record<string, unknown>>) =>
  Object.entries(cssObject).map(([selector, attributes]) =>
    selector + "{" +
    Object.entries(attributes).map(([k, v]) => `${k}:${v}`).join(";") +
    "}"
  ).join("");

const title = "kawarimidoll";
const styles = css({
  body: { display: "flex", "justify-content": "center" },
  "#main": { padding: "0.5rem 2rem" },
  ".avatar": { "border-radius": "50%" },
  ".list-item": {
    "border-radius": "5px",
    "border-style": "solid",
    "border-width": "thin",
    margin: "0.5rem",
    padding: "0.5rem 2rem",
  },
});

const iconText = (icon: string, text: string, href?: string) =>
  h(
    "div",
    { class: "list-item" },
    h("img", { src: `https://icongr.am/${icon}.svg?size=18` }),
    NBSP,
    href ? h("a", { href }, text) : text,
  );

const html = "<!DOCTYPE html>" +
  h(
    "html",
    h(
      "head",
      h("meta", { charset: "utf-8" }),
      h("title", title),
      h("style", styles),
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
          style: "height:auto;display:block;margin:0 auto",
          alt: "avatar",
          width: "260",
          height: "260",
          class: "avatar",
          src: "https://avatars.githubusercontent.com/u/8146876?v=4",
        }),
        h("h1", { style: "text-align:center" }, "kawarimidoll"),
        h("hr"),
        h("h2", "I am..."),
        iconText("feather/cpu", "Software developer"),
        iconText("feather/scissors", "Yak shaver"),
        iconText("feather/life-buoy", "Wheel reinventor"),
        iconText("feather/triangle", "Indoor climber"),
        iconText("feather/trending-up", "Long-term investor"),
        iconText("feather/map-pin", "in the Room 101, Japan"),
        h("hr"),
        h("h2", "I am using..."),
        iconText("feather/monitor", "macOS"),
        iconText("feather/smartphone", "iPhone"),
        iconText("feather/terminal", "Neovim"),
        iconText("feather/heart", "Deno"),
        h("hr"),
        h("h2", "links"),
        iconText(
          "feather/twitter",
          "Twitter",
          "https://twitter.com/kawarimidoll",
        ),
        iconText("feather/github", "GitHub", "https://github.com/kawarimidoll"),
        iconText("feather/grid", "Pixela", "https://pixe.la/@kawarimidoll"),
        iconText("feather/book", "Zenn", "https://zenn.dev/kawarimidoll"),
        iconText("feather/search", "Qiita", "https://qiita.com/kawarimidoll"),
        iconText(
          "feather/coffee",
          "Buy me a coffee",
          "https://www.buymeacoffee.com/kawarimidoll",
        ),
        iconText(
          "feather/gitlab",
          "GitLab [stale]",
          "https://gitlab.com/kawarimidoll",
        ),
        iconText(
          "feather/package",
          "npm [stale]",
          "https://www.npmjs.com/~kawarimidoll",
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
