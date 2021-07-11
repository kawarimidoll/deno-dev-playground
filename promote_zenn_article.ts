import { IFTTT_WEBHOOK_KEY } from "./env.ts";
import { addDate, compareAsc } from "./deps.ts";
import { sendTweet } from "./tweet_with_ifttt.ts";
import {
  zennApi,
  zennLink,
  ZennTopic,
} from "https://github.com/kawarimidoll/deno-zenn-api/raw/main/mod.ts";

const { articles } = await zennApi("kawarimidoll");
if (!articles || !articles[0]) {
  throw new Error("No articles found");
}

const article = articles[0];

const { title, emoji, articleType, topics, readingTime, publishedAt } = article;
const isLatest =
  compareAsc(addDate(new Date(publishedAt), { days: 1 }), new Date()) > 0;
if (!isLatest) {
  console.log("The article is already promoted.");
  Deno.exit(0);
}

const link = zennLink(article);

const genTopicsText = (topics: ZennTopic[]) =>
  topics[0]
    ? topics.sort((a, b) => b.taggingsCount - a.taggingsCount).map((t) =>
      t.displayName + "とか"
    ).join("") + "についていろいろ書いています"
    : "";

const message = `#Zenn で『${emoji} ${title}』という${articleType}記事を書きました
${genTopicsText(topics)}
${readingTime}分くらいで読めるのでスキマ時間のお供にどうぞ
${link}
（本ツイートは #Deno 🦕 で自動生成しています）`;

console.log(message);
console.log(await sendTweet({ message, key: IFTTT_WEBHOOK_KEY }));
