import { formatISO, parse } from "./deps.ts";
import { sendTweet } from "./tweet.ts";

// deno install --allow-read --allow-env --allow-net --force tweet_cli.ts

const message = Deno.args[0];
if (!message) {
  console.warn("No message found");
  Deno.exit(1);
}
const result = await sendTweet(message);
if (result.id) {
  const { id, text, created_at: createdAt } = result;

  const timestamp = formatISO(
    parse(createdAt, "E MMM d HH:mm:ss XX yyyy", new Date(), {}),
    {},
  );
  console.log({ id, text, timestamp });
} else {
  // some error occurred
  console.warn(result);
  Deno.exit(1);
}
