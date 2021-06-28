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
// console.log(maxContributionsCount);
// console.log(extractedContributions);

// const colors = [
//   "#ebedf0",
//   "#9be9a8",
//   "#40c463",
//   "#30a14e",
//   "#216e39",
// ];

const fillPixel = (count: number) => {
  if (count === 0) {
    return { r: 253, g: 237, b: 240 };
  } else if (count < maxContributionsCount / 4) {
    return { r: 155, g: 233, b: 168 };
  } else if (count < maxContributionsCount / 2) {
    return { r: 64, g: 196, b: 99 };
  } else if (count < maxContributionsCount * 3 / 4) {
    return { r: 48, g: 161, b: 78 };
  }
  return { r: 33, g: 110, b: 57 };
};

const grass = (count?: number) =>
  (count == null) ? "" : rgb24("■", fillPixel(count));

extractedContributions[0].forEach((_, i) => {
  console.log(
    extractedContributions.map((row) => grass(row[i])).join(""),
  );
});
