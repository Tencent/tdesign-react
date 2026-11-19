#!/usr/bin/env node

/* 从 npm 下载并解压 tdesign-react 最新版本包 */

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { reviewWorktreeDir } from "./worktree-dir.mjs";

const registry = "https://registry.npmjs.org/";
const packageName = "tdesign-react";

function exec(command, args) {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    if (error.stderr) process.stderr.write(error.stderr);
    throw new Error(`${command} ${args.join(" ")} 执行失败`);
  }
}

function installedVersion(packageDir) {
  const manifestPath = path.join(packageDir, "package.json");
  const entryPath = path.join(packageDir, "es/index.js");
  if (!existsSync(manifestPath) || !existsSync(entryPath)) return "";
  return JSON.parse(readFileSync(manifestPath, "utf8")).version || "";
}

try {
  const root = reviewWorktreeDir(import.meta.url);
  const version = exec("npm", [
    "view",
    `${packageName}@latest`,
    "version",
    "--registry",
    registry,
  ]);
  const packageDir = path.join(root, ".review/packages/tdesign-react");

  mkdirSync(path.dirname(packageDir), { recursive: true });

  if (installedVersion(packageDir) === version) process.exit(0);

  const packDir = mkdtempSync(path.join(tmpdir(), "tdesign-code-review-"));
  try {
    const packResult = JSON.parse(
      exec("npm", [
        "pack",
        `${packageName}@${version}`,
        "--pack-destination",
        packDir,
        "--registry",
        registry,
        "--json",
      ]),
    );
    const tarball = packResult?.[0]?.filename;
    if (!tarball) throw new Error("npm pack 未返回压缩包文件名");

    exec("tar", ["-xzf", path.join(packDir, tarball), "-C", packDir]);
    rmSync(packageDir, { recursive: true, force: true });
    renameSync(path.join(packDir, "package"), packageDir);
  } finally {
    rmSync(packDir, { recursive: true, force: true });
  }
} catch (error) {
  process.stderr.write(`[pack-published] ${error.message}\n`);
  process.exit(1);
}
