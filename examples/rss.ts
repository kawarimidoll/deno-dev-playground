import { download, Feed, FeedType, RSS1, RSS2 } from "./../deps.ts";
import { rss } from "./../rss.ts";

const isRss2 = (
  feed: Feed | RSS1 | RSS2,
  feedType: FeedType.Atom | FeedType.Rss1 | FeedType.Rss2,
): feed is RSS2 => feed && feedType === FeedType.Rss2;

const { feed, feedType } = await rss("https://zenn.dev/kawarimidoll/feed");
if (!isRss2(feed, feedType)) {
  throw new Error("Invalid feed type");
}

const item = feed.channel?.items[0];
if (!item) {
  throw new Error("Item not found");
}

const { title, link, enclosure } = item;
const url = enclosure?.url;
if (!url) {
  throw new Error("URL not found");
}

console.log({ title, link, url });
const file = "zenn_article.png";
const dir = ".";
await download(url, { file, dir });

// const readme = "./README.md";
// const text = await Deno.readTextFile(readme);
//
// console.log(text);
// [[javascript]URLを取得する正規表現 - Qiita](https://qiita.com/nagimaruxxx/items/c2f186a2df5e32233122)
// const urlStr = "https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+";
// const replaceFlg = "<!-- zenn-article-link-next-line -->";
// const regex = new RegExp(`(${replaceFlg}\n.*)${urlStr}`);
// const regex = new RegExp(`${startFlg}\n(?:(?<content>[\\s\\S]+)\n)?${endFlg}`)
// console.log(text.match(regex));
//
// const newURL = "https://zenn.dev/kawarimidoll/articles/new_article";
// console.log(text.replace(regex, `$1${newURL}`));
// await Deno.writeTextFile(readme, text.replace(regex, `$1${newURL}`));
