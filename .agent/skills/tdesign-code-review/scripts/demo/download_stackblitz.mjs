#!/usr/bin/env node

/* 下载 StackBlitz Demo 到指定目录 */

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const [urlValue, outputDir] = process.argv.slice(2);

if (!urlValue || !path.isAbsolute(outputDir || "")) {
  console.error(
    "Usage: node download_stackblitz.mjs <url> <absolute-output-dir>",
  );
  process.exit(1);
}

const demoUrl = new URL(urlValue);
const hostname = demoUrl.hostname.replace(/^www\./, "").toLowerCase();
if (hostname !== "stackblitz.com") {
  console.error(`unsupported demo provider: ${hostname}`);
  process.exit(1);
}
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

function safeDestination(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/").replace(/^\/+/, "");
  const destination = path.resolve(outputDir, normalized);
  if (
    !normalized ||
    normalized.split("/").includes("..") ||
    !destination.startsWith(`${path.resolve(outputDir)}${path.sep}`)
  ) {
    throw new Error(`unsafe demo file path: ${relativePath}`);
  }
  return destination;
}

function writeProjectFile(relativePath, contents) {
  const destination = safeDestination(relativePath);
  mkdirSync(path.dirname(destination), { recursive: true });
  const value =
    typeof contents === "string" || Buffer.isBuffer(contents)
      ? contents
      : JSON.stringify(contents ?? "", null, 2);
  writeFileSync(destination, value);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "tdesign-code-review",
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`failed to download demo: ${response.status} ${url}`);
  }
  return response.json();
}

async function downloadStackBlitz() {
  const editMatch = demoUrl.pathname.match(/^\/edit\/([^/]+)/i);
  if (editMatch) {
    const projectId = editMatch[1];
    if (!/^[\w-]+$/.test(projectId)) {
      throw new Error(`invalid StackBlitz project id: ${projectId}`);
    }
    const response = await fetchJson(
      `https://stackblitz.com/api/projects/${projectId}?include_files=true`,
    );
    const appFiles = response?.project?.appFiles;
    if (!appFiles || typeof appFiles !== "object") {
      throw new Error("StackBlitz response does not contain project files");
    }
    for (const [filePath, file] of Object.entries(appFiles)) {
      if (file?.type === "file") {
        writeProjectFile(file.fullPath || filePath, file.contents);
      }
    }
    return;
  }

  const githubMatch = demoUrl.pathname.match(
    /^\/github\/([^/]+)\/([^/]+)(?:\/tree\/(.+))?$/i,
  );
  if (!githubMatch) {
    throw new Error(`unsupported StackBlitz URL: ${demoUrl.href}`);
  }

  const [, owner, repo, ref = "HEAD"] = githubMatch;
  if (
    !/^[\w.-]+$/.test(owner) ||
    !/^[\w.-]+$/.test(repo) ||
    !/^[\w./-]+$/.test(ref)
  ) {
    throw new Error(`invalid StackBlitz GitHub URL: ${demoUrl.href}`);
  }

  execFileSync("git", ["init", "--quiet", outputDir]);
  execFileSync(
    "git",
    [
      "-C",
      outputDir,
      "remote",
      "add",
      "origin",
      `https://github.com/${owner}/${repo}.git`,
    ],
    { stdio: "ignore" },
  );
  execFileSync(
    "git",
    ["-C", outputDir, "fetch", "--quiet", "--depth=1", "origin", ref],
    { stdio: "ignore" },
  );
  execFileSync(
    "git",
    ["-C", outputDir, "checkout", "--quiet", "--detach", "FETCH_HEAD"],
    { stdio: "ignore" },
  );
  rmSync(path.join(outputDir, ".git"), { recursive: true, force: true });
}

try {
  await downloadStackBlitz();
} catch (error) {
  rmSync(outputDir, { recursive: true, force: true });
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
