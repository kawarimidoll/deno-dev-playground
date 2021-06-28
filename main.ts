import { ky } from "./deps.ts";
import { GITHUB_READ_USER_TOKEN } from "./env.ts";

const query = `
query {
  viewer {
    login
  }
}
`;

const url = "https://api.github.com/graphql";

const json = { query };

const result = await ky.post(url, {
  headers: { Authorization: `Bearer ${GITHUB_READ_USER_TOKEN}` },
  json,
}).json();

console.log(result);
