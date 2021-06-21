import { LINE_ACCESS_TOKEN } from "./env.ts";
import { Logger } from "./logger.ts";
const url = "https://notify-api.line.me/api/notify";

const body: URLSearchParams = new URLSearchParams({
  message: "hello from deno!",
});

const res = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body,
});

const json = await res.json();
Logger.info(json);
