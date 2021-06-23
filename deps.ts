import ky from "https://cdn.skypack.dev/ky?dts";
import {
  deserializeFeed,
  FeedType,
} from "https://deno.land/x/rss@0.3.6/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.12-alpha/deno-dom-wasm.ts";

export { deserializeFeed, DOMParser, FeedType, ky };
