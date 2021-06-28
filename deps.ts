import ky from "https://cdn.skypack.dev/ky?dts";
import {
  deserializeFeed,
  Feed,
  FeedType,
  RSS1,
  RSS2,
} from "https://deno.land/x/rss@0.3.6/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.12-alpha/deno-dom-wasm.ts";
import { download } from "https://deno.land/x/download@v1.0.1/mod.ts";

export { deserializeFeed, DOMParser, download, FeedType, ky };
export type { Feed, RSS1, RSS2 };
