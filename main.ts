import { ky, rgb24 } from "./deps.ts";
import { GITHUB_READ_USER_TOKEN } from "./env.ts";

// https://lab.syncer.jp/Web/JavaScript/Snippet/61/
const hexToRgb = (hex: string) => {
  if (hex.slice(0, 1) == "#") hex = hex.slice(1);
  if (hex.length == 3) {
    hex = hex.slice(0, 1) + hex.slice(0, 1) + hex.slice(1, 2) +
      hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3);
  }

  const r = parseInt("0x" + hex.slice(0, 2));
  const g = parseInt("0x" + hex.slice(2, 4));
  const b = parseInt("0x" + hex.slice(4, 6));

  return { r, g, b };
};

const userName = "kawarimidoll";

const query = `
 query($userName:String!) {
   user(login: $userName){
     contributionsCollection {
       contributionCalendar {
         totalContributions
         weeks {
           contributionDays {
             color
             contributionCount
             contributionLevel
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

interface ContributionDay {
  contributionCount: number;
  contributionLevel: string;
  date: string;
  color: string;
}
const { weeks, totalContributions }: {
  weeks: { contributionDays: ContributionDay[] }[];
  totalContributions: number;
} = data?.user?.contributionsCollection
  ?.contributionCalendar;

if (!weeks || !totalContributions) {
  throw new Error("Could not get contributions data");
}

console.log(totalContributions + " contributions in the last year");

// console.log(weeks[weeks.length - 1]);
// console.log(weeks.slice(weeks.length - 7));
// console.log(weeks.length);

// weeks[0].contributionDays.forEach((_, i) => {
//   console.log(
//     weeks.map((row) =>
//       `${row.contributionDays[i]?.contributionCount ?? ""}`.padStart(3)
//     ).join(""),
//   );
// });

// let maxContributionsCount = 0;
// const extractedContributions: ContributionDay[][] = weeks.map((
//   week: { contributionDays: ContributionDay[] },
// ) =>
//   week.contributionDays.map(
//     (day) => {
//       if (day.contributionCount > maxContributionsCount) {
//         maxContributionsCount = day.contributionCount;
//       }
//       return day;
//     },
//   )
// );
// console.log(maxContributionsCount);
// console.log(extractedContributions);

const colors = [
  // "#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39",
  "#eeeeee",
  "#f8bbd0",
  "#f06292",
  "#e91e63",
  "#880e4f",
];

const fillPixel = (day?: ContributionDay) => {
  switch (day?.contributionLevel) {
    case "NONE":
      return hexToRgb(colors[0]);
    case "FIRST_QUARTILE":
      return hexToRgb(colors[1]);
    case "SECOND_QUARTILE":
      return hexToRgb(colors[2]);
    case "THIRD_QUARTILE":
      return hexToRgb(colors[3]);
    case "FOURTH_QUARTILE":
      return hexToRgb(colors[4]);
  }
  return hexToRgb("#eeeeee");
};

const grass = (day?: ContributionDay) =>
  day?.color ? rgb24("■", fillPixel(day)) : "";
// day?.color ? rgb24("■", hexToRgb(day.color)) : "";

// const grass = (color?: string) =>
//   color
//     ? rgb24("■", {
//       r: parseInt(`0x${color.slice(1, 3)}`),
//       b: parseInt(`0x${color.slice(3, 5)}`),
//       g: parseInt(`0x${color.slice(5, 7)}`),
//     })
//     : "";

// weeks[0].contributionDays.forEach((_, i) => {
//   console.log(
//     weeks.map((row) => grass(row.contributionDays[i]?.color)).join(""),
//   );
// });
weeks[0].contributionDays.forEach((_, i) => {
  console.log(
    weeks.map((row) => grass(row.contributionDays[i])).join(""),
  );
});
