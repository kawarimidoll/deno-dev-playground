import { LINE_ACCESS_TOKEN, Logger } from "./deps.ts";
const url = "https://notify-api.line.me/api/notify";

// [[超簡単]LINE notify を使ってみる - Qiita](https://qiita.com/iitenkida7/items/576a8226ba6584864d95)
// [Deno - How to fetch data from distant API or URL? - Stack Overflow](https://stackoverflow.com/questions/62076221/deno-how-to-fetch-data-from-distant-api-or-url)

const body: URLSearchParams = new URLSearchParams({
  message: "hello from deno!",
});

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${LINE_ACCESS_TOKEN}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body,
});

const json = await res.json();
Logger.info(json);
