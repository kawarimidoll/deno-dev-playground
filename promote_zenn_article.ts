import { DOMParser, ky } from "./deps.ts";
const ZENN_ROOT = "https://zenn.dev";

const genPromotion = async (username: string) => {
  const dom = new DOMParser().parseFromString(
    await ky(username, { prefixUrl: ZENN_ROOT }).text(),
    "text/html",
  );
  if (!dom) {
    console.error("Parse error");
    Deno.exit(1);
  }

  console.log("parse succeed");
  const article = dom.getElementsByTagName("article")[0];
  if (!article) {
    console.error("Article not found");
    Deno.exit(1);
  }

  const title = article.getElementsByTagName("h3")[0].innerText;
  const links = article.getElementsByTagName("a");
  const link = ZENN_ROOT + links[1].getAttribute("href");
  const tags = links.reduce((acc, current) => {
    const path = current.getAttribute("href");
    return (path?.startsWith("/topics")) ? [...acc, current.innerText] : acc;
  }, [] as string[]);
  const tagText = tags[0]
    ? `${tags.join("とか") + (tags[1] ? "とか" : "")}についていろいろ書いています`
    : "";
  const readTime = links[links.length - 1].getElementsByTagName("span")[0]
    .innerText.replace(/^(\d+).*$/, "$1");

  return `『${title}』という #Zenn 記事を書きました
${tagText}
${readTime}分くらいで読めるのでスキマ時間のお供にどうぞ
${link}
（本ツイートはDeno🦕で自動生成しています）`;
};

export { genPromotion };
