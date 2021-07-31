import { tag as h } from "https://deno.land/x/markup_tag@0.1.2/mod.ts";

const css = (cssObject: Record<string, Record<string, unknown>>) =>
  Object.entries(cssObject).map(([selector, attributes]) =>
    selector + "{" +
    Object.entries(attributes).map(([k, v]) => `${k}:${v}`).join(";") +
    "}"
  ).join("");

const title = "kawarimidoll";
const styles = css({
  body: { display: "flex", "justify-content": "center", margin: "0" },
  a: { "text-decoration": "none" },
  "h1,h2": { "text-align": "center" },
  h2: { "margin-block-start": "2rem", "margin-block-end": "0" },
  img: { display: "block", margin: "0 auto" },
  "#main": { width: "100%", "max-width": "800px", padding: "1rem 0.5rem" },
  ".avatar": { "border-radius": "50%", height: "auto" },
  ".list-group": { "max-width": "500px", margin: "0 auto" },
  ".list-item": {
    "border-radius": "5px",
    "border-style": "solid",
    "border-width": "thin",
    margin: "0.5rem auto",
    padding: "0.5rem 2rem",
  },
  ".nav": {
    display: "flex",
    "justify-content": "space-around",
    width: "60%",
    margin: "0 auto",
    "max-width": "500px",
  },
  ".nav>a": {
    display: "block",
  },
});

const icongram = (name: string, size = 20) =>
  h("img", { src: `https://icongr.am/${name}.svg?size=${size}`, alt: name });

const iconText = (icon: string, text: string) =>
  h(
    "div",
    { class: "list-item" },
    icongram(icon),
    h("div", { style: "margin:0 auto;text-align:center" }, text),
  );

const iconLink = (icon: string, text: string, href: string) =>
  h("a", { href }, iconText(icon, text));

const html = "<!DOCTYPE html>" +
  h(
    "html",
    h(
      "head",
      h("meta", { charset: "utf-8" }),
      h("meta", {
        name: "viewport",
        content: "width=device-width,initial-scale=1.0",
      }),
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
          alt: "avatar",
          width: "260",
          class: "avatar",
          src: "https://avatars.githubusercontent.com/u/8146876?v=4",
        }),
        h("h1", "kawarimidoll"),
        h(
          "div",
          { class: "nav" },
          h("a", { href: "#profiles" }, icongram("feather/smile", 26)),
          h("a", { href: "#tools" }, icongram("feather/tool", 26)),
          h("a", { href: "#links" }, icongram("feather/link", 26)),
        ),
        h("hr"),
        h(
          "div",
          { class: "list-group" },
          h("h2", { id: "profiles" }, icongram("feather/smile", 40)),
          iconText("feather/cpu", "Software developer"),
          iconText("feather/scissors", "Yak shaver"),
          iconText("feather/life-buoy", "Wheel reinventor"),
          iconText("feather/triangle", "Indoor climber"),
          iconText("feather/trending-up", "Long-term investor"),
          iconText("feather/map-pin", "Room 101, Japan"),
          h("h2", { id: "tools" }, icongram("feather/tool", 40)),
          iconText("feather/monitor", "macOS"),
          iconText("feather/smartphone", "iPhone"),
          iconText("feather/terminal", "Neovim"),
          iconText("feather/heart", "Deno"),
          h("h2", { id: "links" }, icongram("feather/link", 40)),
          iconLink(
            "feather/twitter",
            "Twitter",
            "https://twitter.com/kawarimidoll",
          ),
          iconLink(
            "feather/github",
            "GitHub",
            "https://github.com/kawarimidoll",
          ),
          iconLink("feather/grid", "Pixela", "https://pixe.la/@kawarimidoll"),
          iconLink("feather/book", "Zenn", "https://zenn.dev/kawarimidoll"),
          iconLink(
            "feather/search",
            "Qiita",
            "https://qiita.com/kawarimidoll",
          ),
          iconLink(
            "feather/coffee",
            "Buy me a coffee",
            "https://www.buymeacoffee.com/kawarimidoll",
          ),
          iconLink(
            "feather/globe",
            "My site [under construction]",
            "https://kawarimidoll.com",
          ),
          iconLink(
            "feather/gitlab",
            "GitLab [stale]",
            "https://gitlab.com/kawarimidoll",
          ),
          iconLink(
            "feather/package",
            "npm [stale]",
            "https://www.npmjs.com/~kawarimidoll",
          ),
          h("h2", { id: "supports" }, icongram("feather/gift", 40)),
          iconLink(
            "feather/truck",
            "Uber Eats promotion code: eats-2j5di9k7b0",
            "https://ubereats.com/feed?promoCode=eats-2j5di9k7b0",
          ),
          iconLink(
            "feather/dollar-sign",
            "Moppy invitation code: rUK7e101",
            "https://pc.moppy.jp/entry/invite.php?invite=rUK7e101",
          ),
          iconLink(
            "feather/shopping-bag",
            "Rakuma invitation code: GHMt4",
            "https://fril.jp/download",
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
