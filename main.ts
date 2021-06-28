import { ky } from "./deps.ts";
import { GITHUB_READ_USER_TOKEN } from "./env.ts";
import { rgb24 } from "https://deno.land/std@0.99.0/fmt/colors.ts";

const userName = "kawarimidoll";

const query = `
 query($userName:String!) {
   user(login: $userName){
     contributionsCollection {
       contributionCalendar {
         totalContributions
         weeks {
           contributionDays {
             contributionCount
             date
           }
         }
       }
     }
   }
 }
 `;
const variables = `
 {
   "userName": "${userName}"
 }
 `;

const url = "https://api.github.com/graphql";

const json = { query, variables };

const { data } = await ky.post(url, {
  headers: { Authorization: `Bearer ${GITHUB_READ_USER_TOKEN}` },
  json,
}).json();

const { weeks, totalContributions } = data?.user?.contributionsCollection
  ?.contributionCalendar;

if (!weeks || !totalContributions) {
  throw new Error("Could not get contributions data");
}

console.log(totalContributions + " contributions in the last year");

let maxContributionsCount = 0;
interface ContributionDay {
  contributionCount: number;
  date: string;
}

const extractedContributions: number[][] = weeks.map((
  week: { contributionDays: ContributionDay[] },
) =>
  week.contributionDays.map(
    (day) => {
      if (day.contributionCount > maxContributionsCount) {
        maxContributionsCount = day.contributionCount;
      }
      return day.contributionCount;
    },
  )
);
console.log(maxContributionsCount);
console.log(extractedContributions);
