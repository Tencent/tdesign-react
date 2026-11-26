#!/usr/bin/env node

/* 启动或复用当前 PR 的独立 Review Vite 应用 */

import { spawn } from "node:child_process";
import { existsSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { reviewWorktreeDir } from "../libs/worktree-dir.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const runtimeDir = path.resolve(scriptDir, "../..");
const stateFile = path.join(runtimeDir, "restore-state.env");

if (!existsSync(stateFile)) {
  process.stderr.write(`[ensure-dev] 缺少运行状态：${stateFile}\n`);
  process.exit(1);
}

const root = reviewWorktreeDir();
const pr = path.basename(runtimeDir).replace(/^pr-/, "");
const host = `pr-${pr}.localhost`;
const appDir = path.join(root, `.review/pr-${pr}`);
const siteDir = path.join(root, "packages/tdesign-react/site");
const configFile = path.join(appDir, "vite.config.mjs");
const pidFile = path.join(runtimeDir, "dev.pid");
const portFile = path.join(runtimeDir, "dev.port");
const logFile = path.join(runtimeDir, "dev.log");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function portFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen({ host: "127.0.0.1", port }, () => {
      server.close(() => resolve(true));
    });
  });
}

async function httpOk(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return response.ok;
  } catch {
    return false;
  }
}

function tail(file, lines) {
  try {
    return readFileSync(file, "utf8").split("\n").slice(-lines).join("\n");
  } catch {
    return "";
  }
}

function detach(command) {
  const logFd = openSync(logFile, "a", 0o644);
  return new Promise((resolve, reject) => {
    const child = spawn(command[0], command.slice(1), {
      cwd: appDir,
      detached: true,
      stdio: ["ignore", logFd, logFd],
    });
    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve(child.pid);
    });
  });
}

async function publishUrl(port, pid, reused) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await httpOk(`http://${host}/`)) {
      console.log(JSON.stringify({
        port,
        pid,
        reused,
        appDir,
        url: `http://${host}/`,
      }));
      process.exit(0);
    }
    await sleep(200);
  }

  process.stderr.write("[ensure-dev] 80 端口转发不可用，演示地址仍带端口。\n");
  console.log(JSON.stringify({
    port,
    pid,
    reused,
    appDir,
    url: `http://${host}:${port}/`,
  }));
  process.exit(0);
}

if (!existsSync(configFile)) {
  process.stderr.write(`[ensure-dev] Review 应用不存在：${appDir}，请先执行 write-demo.mjs\n`);
  process.exit(1);
}

if (existsSync(pidFile) && existsSync(portFile)) {
  const savedPid = Number(readFileSync(pidFile, "utf8"));
  const savedPort = Number(readFileSync(portFile, "utf8"));
  if (alive(savedPid) && await httpOk(`http://127.0.0.1:${savedPort}/`)) {
    await publishUrl(savedPort, savedPid, true);
  }
  rmSync(pidFile, { force: true });
  rmSync(portFile, { force: true });
}

let port = 0;
for (let candidate = 5173; candidate <= 5273; candidate += 1) {
  if (await portFree(candidate)) {
    port = candidate;
    break;
  }
}

if (!port) {
  process.stderr.write("[ensure-dev] 5173-5273 范围内没有可用端口\n");
  process.exit(1);
}

const devPid = await detach([
  "pnpm",
  "--dir",
  siteDir,
  "exec",
  "vite",
  appDir,
  "--config",
  configFile,
  "--host",
  "127.0.0.1",
  "--port",
  String(port),
  "--strictPort",
]);
writeFileSync(pidFile, `${devPid}\n`);
writeFileSync(portFile, `${port}\n`);

for (let attempt = 0; attempt < 60; attempt += 1) {
  if (await httpOk(`http://127.0.0.1:${port}/`)) {
    await publishUrl(port, devPid, false);
  }
  if (!alive(devPid)) {
    process.stderr.write("[ensure-dev] Review Vite 应用启动失败，日志如下：\n");
    process.stderr.write(`${tail(logFile, 30)}\n`);
    rmSync(pidFile, { force: true });
    rmSync(portFile, { force: true });
    process.exit(1);
  }
  await sleep(1000);
}

try {
  process.kill(devPid, "SIGTERM");
} catch {
  // 进程已经退出时无需再处理
}
rmSync(pidFile, { force: true });
rmSync(portFile, { force: true });
process.stderr.write(`[ensure-dev] 等待 Review Vite 应用超时，日志路径：${logFile}\n`);
process.exit(1);
