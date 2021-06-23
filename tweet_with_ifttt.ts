import { ky } from "./deps.ts";
const prefixUrl = "https://maker.ifttt.com/trigger/send_tweet/with/key/";

const sendTweet = async (params: { message: string; key: string }) => {
  const { message, key } = params;

  try {
    return await ky.post(key, { prefixUrl, json: { value1: message } }).text();
  } catch (error) {
    console.error(await error);
    return await error.response?.text();
  }
};

export { sendTweet };
