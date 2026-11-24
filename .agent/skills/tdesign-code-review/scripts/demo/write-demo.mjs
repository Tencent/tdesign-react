#!/usr/bin/env node

/* 生成独立的 .review/pr-<N> Vite 演示应用 */

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { reviewWorktreeDir } from "../libs/worktree-dir.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(__dirname, "templates");

const [pr, description, demoFile, mode = "compare"] = process.argv.slice(2);

if (!/^\d+$/.test(pr || "") || !description || !demoFile) {
  console.error(
    "Usage: node write-demo.mjs <pr> <description> <demo-function-file> [compare|standalone]",
  );
  process.exit(1);
}
if (!["compare", "standalone"].includes(mode)) {
  console.error(`unsupported mode: ${mode}`);
  process.exit(1);
}

function renderTemplate(name, values = {}) {
  let text = readFileSync(path.join(TEMPLATE_DIR, name), "utf8");
  text = text.replace(/^\/\/\/ <reference path="\.\/types\.d\.ts" \/>\n/, "");
  const rawKeys = new Set(["__DESCRIPTION_JSON__"]);
  const entries = Object.entries(values).sort((a, b) => b[0].length - a[0].length);
  for (const [key, value] of entries) {
    if (!text.includes(key)) {
      console.error(`template ${name} missing ${key}`);
      process.exit(1);
    }
    if (rawKeys.has(key)) continue;
    text = text.replaceAll(key, value);
  }
  for (const key of rawKeys) {
    if (key in values) text = text.replaceAll(key, values[key]);
  }
  return text;
}

const root = reviewWorktreeDir();
const serverAllow = [root];
const nodeModules = path.join(root, "node_modules");
if (existsSync(nodeModules)) {
  const dependencyRoot = path.dirname(realpathSync(nodeModules));
  if (dependencyRoot !== root) serverAllow.push(dependencyRoot);
}
const demoSource = readFileSync(demoFile, "utf8").trim();

if (!/export\s+function\s+Demo\s*\(/.test(demoSource)) {
  console.error("demo file must export function Demo");
  process.exit(1);
}

const sourceEntry = path.join(root, "packages/components/index.ts");
const styleEntry = path.join(root, "packages/components/style/index.js");
const publishedDir = path.join(root, ".review/packages/tdesign-react");
const publishedEntry = path.join(publishedDir, "es/index.js");
let publishedVersion;

if (mode === "compare") {
  if (!existsSync(publishedEntry)) {
    console.error(
      `published package entry not found: ${publishedEntry}; run pack-published.mjs first`,
    );
    process.exit(1);
  }
  publishedVersion = JSON.parse(
    readFileSync(path.join(publishedDir, "package.json"), "utf8"),
  ).version;
}

const appDir = path.join(root, `.review/pr-${pr}`);
const srcDir = path.join(appDir, "src");
rmSync(appDir, { recursive: true, force: true });
mkdirSync(srcDir, { recursive: true });

const viewDest = path.join(srcDir, "PrCompareView.tsx");
writeFileSync(viewDest, renderTemplate("PrCompareView.tsx"));

writeFileSync(
  path.join(appDir, "index.html"),
  renderTemplate("index.html", { __PR__: pr }),
);

const publishedImport =
  mode === "compare"
    ? "import * as publishedPkg from '@review/published';"
    : "";
const publishedProps =
  mode === "compare"
    ? `{ publishedComponents: publishedPkg, publishedVersion: ${JSON.stringify(publishedVersion)} }`
    : "{}";

writeFileSync(path.join(srcDir, "Demo.tsx"), `${demoSource}\n`);
writeFileSync(
  path.join(srcDir, "main.tsx"),
  renderTemplate("main.tsx", {
    __PUBLISHED_IMPORT__: publishedImport,
    __DEMO_IMPORT__: 'import { Demo } from "./Demo";',
    __PR__: pr,
    __DESCRIPTION_JSON__: JSON.stringify(description),
    __PR_JSON__: JSON.stringify(pr),
    __PUBLISHED_PROPS__: publishedProps,
  }),
);

const aliases = [
  { find: "@review/pr", replacement: sourceEntry },
  { find: "@review/pr-style", replacement: styleEntry },
  ...(mode === "compare"
    ? [
        {
          find: "@review/published",
          replacement: publishedEntry,
        },
      ]
    : []),
];

const sourcePkg = JSON.parse(
  readFileSync(path.join(root, "packages/tdesign-react/package.json"), "utf8"),
);
const reviewStateDir = path.join(
  execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
    cwd: root,
    encoding: "utf8",
  }).trim(),
  "tdesign-code-review",
);
const configPath = path.join(appDir, "vite.config.mjs");

writeFileSync(
  configPath,
  renderTemplate("vite.config.mjs", {
    __APP_DIR_JSON__: JSON.stringify(appDir),
    __SOURCE_VERSION_JSON__: JSON.stringify(sourcePkg.version),
    __ALIASES_JSON__: JSON.stringify(aliases, null, 2),
    __SERVER_ALLOW_JSON__: JSON.stringify(serverAllow),
    __REVIEW_HOST_JSON__: JSON.stringify(`pr-${pr}.localhost`),
    __REVIEW_STATE_DIR_JSON__: JSON.stringify(reviewStateDir),
    __REVIEW_CONFIG_PATH_JSON__: JSON.stringify(configPath),
  }),
);

console.log(
  JSON.stringify({
    appDir,
    demoPath: path.join(srcDir, "main.tsx"),
    compareViewPath: viewDest,
    configPath: path.join(appDir, "vite.config.mjs"),
    mode,
    route: "/",
  }),
);
