import { getContributions } from "https://github.com/kawarimidoll/deno-github-contributions-api/raw/main/mod.ts";

import { GITHUB_READ_USER_TOKEN } from "./env.ts";

const username = "kawarimidoll";
const token = GITHUB_READ_USER_TOKEN;

const contributions = await getContributions(username, token);

console.log(contributions.toTerm({ scheme: "random" }));
