import { ky } from "./deps.ts";
import { LINE_ACCESS_TOKEN } from "./env.ts";
import { Logger } from "./logger.ts";
const url = "https://notify-api.line.me/api/notify";

const body = new URLSearchParams({
  message: "hello from ky!",
});

const json = await ky.post(url, {
  headers: {
    Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
  },
  body,
}).json();

Logger.info(json);
