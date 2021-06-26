import { IFTTT_WEBHOOK_KEY } from "./env.ts";
import { sendTweet } from "./tweet_with_ifttt.ts";
import {
  zennApi,
  zennLink,
  ZennTopic,
} from "https://github.com/kawarimidoll/deno-zenn-api/raw/main/mod.ts";

const { articles } = await zennApi("kawarimidoll");
const article = articles[0];
if (!article) {
  throw new Error("No articles found");
}

const { title, emoji, topics, readingTime } = article;
const link = zennLink(article);

const genTopicsText = (topics: ZennTopic[]) =>
  topics[0]
    ? topics.sort((a, b) => b.taggingsCount - a.taggingsCount).map((t) =>
      t.displayName + "とか"
    ).join("") + "についていろいろ書いています"
    : "";

const message = `『${emoji} ${title}』という #Zenn 記事を書きました
${genTopicsText(topics)}
${readingTime}分くらいで読めるのでスキマ時間のお供にどうぞ
${link}
（本ツイートはDeno🦕で自動生成しています）`;

console.log(message);
console.log(await sendTweet({ message, key: IFTTT_WEBHOOK_KEY }));
