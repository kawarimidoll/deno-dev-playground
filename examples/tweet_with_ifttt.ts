import { Logger } from "./../logger.ts";
import { invoke } from "./../ifttt_webhook.ts";
import { IFTTT_WEBHOOK_KEY } from "./../env.ts";
Logger.info(
  await invoke({
    webhookName: "send_tweet",
    webhookKey: IFTTT_WEBHOOK_KEY,
    value1: "IFTTT経由でDenoからツイート",
  }),
);
