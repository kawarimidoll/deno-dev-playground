import { zennApi } from "https://github.com/kawarimidoll/deno-zenn-api/raw/main/mod.ts";
console.log(await zennApi("topics"));
console.log(await zennApi("scraps/explore"));
console.log(await zennApi("books", { order: "alltime", page: 2 }));
