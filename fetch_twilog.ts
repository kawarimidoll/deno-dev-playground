import { ky } from "./deps.ts";
import { PIXELA_TOKEN } from "./env.ts";

const twitterUsername = "kawarimidoll";
const pixelaUsername = "kawarimidoll";
const pixelaGraphId = "tweets";

const html = await ky(`https://twilog.org/${twitterUsername}/stats`).text();

const tweets = html.match(/ar_data\[1\]\s*=\s*\[([^\]]+)\];/);
const dates = html.match(/ar_lbl\[1\]\s*=\s*\[([^\]]+)\];/);

if (!tweets || !dates || !tweets[1] || !dates[1]) {
  console.warn("fetch failed");
  Deno.exit(1);
}

const getLength = 3;
const tweetsArray = tweets[1].split(",").slice(-getLength);
const datesArray = dates[1].split(",").slice(-getLength);

for (let i = 0; i < tweetsArray.length; i++) {
  const url =
    `https://pixe.la/v1/users/${pixelaUsername}/graphs/${pixelaGraphId}/20${
      datesArray[i].replaceAll("'", "")
    }`;
  const json = { quantity: tweetsArray[i] };
  console.log(url, json);

  console.log(
    await ky.put(url, { headers: { "X-USER-TOKEN": PIXELA_TOKEN }, json })
      .json(),
  );
  // wait 2 sec...
  await new Promise((resolve) => setTimeout(resolve, 2000));
}
