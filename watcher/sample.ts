import { name } from "./const.ts";
console.log("My app is running...!");
console.log("hello", name);

for (let i = 1; i < 11; i++) {
  setTimeout(() => {
    console.log(`${i}...`);
  }, i * 1000);
}

// setTimeout(() => {
//   throw new Error("My app has thrown an error!");
// }, 1000);
