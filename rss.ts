import { deserializeFeed, ky } from "./deps.ts";

const rss = async (url: string) => await deserializeFeed(await ky(url).text());

export { rss };
