import { addDate, compareAsc, ky, stringWidth } from "./deps.ts";
import { sendTweet } from "./tweet.ts";
import { ZennTopic } from "https://pax.deno.dev/kawarimidoll/deno-zenn-api";

const { id } = await ky("https://zenn-api.deno.dev/kawarimidoll/feed?latest")
  .json();
if (!id) {
  throw new Error("No id found");
}
const { article, topics } = await ky(
  `https://zenn-api.deno.dev${id.replace("https://zenn.dev", "")}`,
).json();
if (!article) {
  throw new Error("No articles found");
}

const { title, emoji, articleType, publishedAt } = article;
const isLatest =
  compareAsc(addDate(new Date(publishedAt), { days: 1 }), new Date()) > 0;
if (!isLatest) {
  console.log("The article is already promoted.");
  Deno.exit(0);
}

const header = `#Zenn で『${emoji} ${title}』という${articleType}記事を書きました`;
const footer = "(This tweet is auto-generated by #Deno 🦕)";

const genTopicsText = (topics: ZennTopic[]) => {
  if (!topics[0]) {
    return "";
  }

  const suffix = "についていろいろ書いています";

  // url string length is always 22, lines are 6
  const length = stringWidth(header + footer + suffix) + 22 + 6;
  const sortedTopics = topics.sort((a, b) => b.taggingsCount - a.taggingsCount);
  let topicsText = "";

  for (const topic of sortedTopics) {
    const text = "とか" + topic.displayName;

    if (length + stringWidth(topicsText + text) >= 280) {
      break;
    }
    topicsText += text;
  }

  return topicsText.replace("とか", "") + suffix;
};

const message = [
  header,
  genTopicsText(topics),
  id,
  footer,
].join("\n");

console.log(message);
const result = await sendTweet(message);
console.log(result);
if (result.errors) {
  Deno.exit(1);
}
