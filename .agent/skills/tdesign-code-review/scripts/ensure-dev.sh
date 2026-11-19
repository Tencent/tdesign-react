#!/usr/bin/env bash

# 启动或复用当前 PR 的独立 Review Vite 应用

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$(dirname "${SCRIPT_DIR}")"
STATE_FILE="${RUNTIME_DIR}/restore-state.env"
if [[ ! -f "${STATE_FILE}" ]]; then
  echo "[ensure-dev] 缺少运行状态：${STATE_FILE}" >&2
  exit 1
fi
# shellcheck disable=SC1090
source "${STATE_FILE}"
: "${WORKTREE_DIR:?WORKTREE_DIR missing from restore-state.env}"
ROOT="${WORKTREE_DIR}"
N="$(basename "${RUNTIME_DIR}" | sed 's/^pr-//')"
APP_DIR="${ROOT}/.review/pr-${N}"
SITE_DIR="${ROOT}/packages/tdesign-react/site"
CONFIG_FILE="${APP_DIR}/vite.config.mjs"
PID_FILE="${RUNTIME_DIR}/dev.pid"
PORT_FILE="${RUNTIME_DIR}/dev.port"
LOG_FILE="${RUNTIME_DIR}/dev.log"

if [[ ! -f "${CONFIG_FILE}" ]]; then
  echo "[ensure-dev] Review 应用不存在：${APP_DIR}，请先执行 write-demo.mjs" >&2
  exit 1
fi

if [[ -f "${PID_FILE}" && -f "${PORT_FILE}" ]]; then
  PID="$(cat "${PID_FILE}")"
  PORT="$(cat "${PORT_FILE}")"
  if kill -0 "${PID}" 2>/dev/null && curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
    node -e '
      const [port, pid, appDir] = process.argv.slice(1);
      console.log(JSON.stringify({
        port: Number(port),
        pid: Number(pid),
        reused: true,
        appDir,
        url: `http://127.0.0.1:${port}/`,
      }));
    ' "${PORT}" "${PID}" "${APP_DIR}"
    exit 0
  fi
  rm -f "${PID_FILE}" "${PORT_FILE}"
fi

PORT=""
for candidate in $(seq 5173 5273); do
  if ! lsof -nP -iTCP:"${candidate}" -sTCP:LISTEN >/dev/null 2>&1; then
    PORT="${candidate}"
    break
  fi
done

if [[ -z "${PORT}" ]]; then
  echo "[ensure-dev] 5173-5273 范围内没有可用端口" >&2
  exit 1
fi

# fork 后 setsid，使演示服务留在新会话里
DEV_PID="$(
  python3 -c '
import os, sys
app_dir, log_file = sys.argv[1], sys.argv[2]
cmd = sys.argv[3:]
pid = os.fork()
if pid > 0:
    print(pid, end="")
    raise SystemExit(0)
os.setsid()
os.chdir(app_dir)
fd = os.open(log_file, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
os.dup2(fd, 1)
os.dup2(fd, 2)
os.close(fd)
devnull = os.open(os.devnull, os.O_RDONLY)
os.dup2(devnull, 0)
os.close(devnull)
os.execvp(cmd[0], cmd)
' "${APP_DIR}" "${LOG_FILE}" \
    pnpm --dir "${SITE_DIR}" exec vite "${APP_DIR}" \
    --config "${CONFIG_FILE}" \
    --host 127.0.0.1 \
    --port "${PORT}" \
    --strictPort
)"
printf '%s\n' "${DEV_PID}" > "${PID_FILE}"
printf '%s\n' "${PORT}" > "${PORT_FILE}"

for _ in $(seq 1 60); do
  if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
    node -e '
      const [port, pid, appDir] = process.argv.slice(1);
      console.log(JSON.stringify({
        port: Number(port),
        pid: Number(pid),
        reused: false,
        appDir,
        url: `http://127.0.0.1:${port}/`,
      }));
    ' "${PORT}" "${DEV_PID}" "${APP_DIR}"
    exit 0
  fi
  if ! kill -0 "${DEV_PID}" 2>/dev/null; then
    echo "[ensure-dev] Review Vite 应用启动失败，日志如下：" >&2
    tail -n 30 "${LOG_FILE}" >&2 || true
    rm -f "${PID_FILE}" "${PORT_FILE}"
    exit 1
  fi
  sleep 1
done

kill "${DEV_PID}" 2>/dev/null || true
rm -f "${PID_FILE}" "${PORT_FILE}"
echo "[ensure-dev] 等待 Review Vite 应用超时，日志路径：${LOG_FILE}" >&2
exit 1
