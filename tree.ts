import { parse } from "https://deno.land/std@0.100.0/flags/mod.ts";
import { join, resolve } from "https://deno.land/std@0.100.0/path/mod.ts";

// WalkEntry of https://deno.land/std@0.100.0/fs/mod.ts
export interface TreeEntry extends Deno.DirEntry {
  path: string;
}

export interface TreeOptions {
  maxDepth?: number;
  includeFiles?: boolean;
  followSymlinks?: boolean;
  exts?: string[];
  match?: RegExp[];
  skip?: RegExp[];
}

function include(
  path: string,
  exts?: string[],
  match?: RegExp[],
  skip?: RegExp[],
) {
  if (exts && !exts.some((ext) => path.endsWith(ext))) {
    return false;
  }
  if (match && !match.some((pattern) => !!path.match(pattern))) {
    return false;
  }
  if (skip && skip.some((pattern) => !!path.match(pattern))) {
    return false;
  }
  return true;
}

const tree = async (
  root: string,
  prefix = "",
  {
    maxDepth = Infinity,
    includeFiles = true,
    followSymlinks = false,
    exts = undefined,
    match = undefined,
    skip = undefined,
  }: TreeOptions = {},
) => {
  if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
    return;
  }

  const entries: TreeEntry[] = [];
  for await (const entry of Deno.readDir(root)) {
    if (entry.isFile && !includeFiles) {
      continue;
    }
    entries.push({ ...entry, path: join(root, entry.name) });
  }

  if (entries.length == 0) {
    return;
  }

  const sortedEntries = entries.sort((a, b) =>
    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  );
  const lastOne = sortedEntries[entries.length - 1];

  for await (const entry of sortedEntries) {
    const branch = entry === lastOne ? "└── " : "├── ";

    const suffix = (entry.isDirectory) ? "/" : "";

    if (include(entry.path, exts, match, skip)) {
      console.log(prefix + branch + entry.name + suffix);
    }

    if (entry.isDirectory && entry.name !== ".git") {
      const indent = entry === lastOne ? "  " : "│  ";
      await tree(entry.path, prefix + indent, {
        maxDepth: maxDepth - 1,
        includeFiles,
        followSymlinks,
        exts,
        match,
        skip,
      });
    }
  }
};

const {
  a,
  d,
  L,
  u,
  _: [dir = "."],
} = parse(Deno.args);

const skip = [];
if (!a) {
  skip.push(/(^|\/)\./);
}
if (!u) {
  const process = Deno.run({
    cmd: ["git", "status", "--ignored", "-s"],
    stdout: "piped",
    stderr: "piped",
  });
  const outStr = new TextDecoder().decode(await process.output());
  process.close();
  const ignoredList = outStr.replace(/^[^!].+$/gm, "").replace(/^!! /mg, "")
    .split("\n").filter((item) => item).concat(".git");

  ignoredList.forEach((str) => {
    skip.push(new RegExp(str.replace(".", "\\.")));
  });
}

console.log(dir);
await tree(resolve(Deno.cwd(), String(dir)), "", {
  maxDepth: L,
  includeFiles: !d,
  followSymlinks: false,
  exts: undefined,
  match: undefined,
  skip,
});
