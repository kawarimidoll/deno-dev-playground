import ky from "https://cdn.skypack.dev/ky@0.28.5?dts";
import {
  deserializeFeed,
  Feed,
  FeedType,
  RSS1,
  RSS2,
} from "https://deno.land/x/rss@0.3.6/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.12-alpha/deno-dom-wasm.ts";
import { download } from "https://deno.land/x/download@v1.0.1/mod.ts";
import { rgb24 } from "https://deno.land/std@0.99.0/fmt/colors.ts";

import compareAsc from "https://deno.land/x/date_fns@v2.22.1/compareAsc/index.ts";
import add from "https://deno.land/x/date_fns@v2.22.1/add/index.ts";
import parse from "https://deno.land/x/date_fns@v2.22.1/parse/index.js";
import formatISO from "https://deno.land/x/date_fns@v2.22.1/formatISO/index.js";

export {
  add as addDate,
  compareAsc,
  deserializeFeed,
  DOMParser,
  download,
  FeedType,
  formatISO,
  ky,
  parse,
  rgb24,
};
export type { Feed, RSS1, RSS2 };
