import { ky } from "./deps.ts";

export async function invoke(
  {
    webhookName = "",
    webhookKey = "",
    value1 = "",
    value2 = "",
    value3 = "",
  },
) {
  try {
    if (!webhookName || !webhookKey) {
      throw new Error("Missing required parameters.");
    }

    const prefixUrl =
      `https://maker.ifttt.com/trigger/${webhookName}/with/key/`;

    return await ky.post(webhookKey, {
      prefixUrl,
      json: { value1, value2, value3 },
    }).text();
  } catch (error) {
    console.error(await error);
    return await error.response?.text();
  }
}
