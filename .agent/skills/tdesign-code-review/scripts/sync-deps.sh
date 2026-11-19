#!/usr/bin/env bash

# 将主工作区已安装的 node_modules 链接到审查 worktree

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$(dirname "${SCRIPT_DIR}")"
STATE_FILE="${RUNTIME_DIR}/restore-state.env"

if [[ ! -f "${STATE_FILE}" ]]; then
  echo "[sync-deps] 缺少运行状态：${STATE_FILE}" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "${STATE_FILE}"
: "${ROOT:?ROOT missing from restore-state.env}"
: "${WORKTREE_DIR:?WORKTREE_DIR missing from restore-state.env}"

NODE_MODULES="${WORKTREE_DIR}/node_modules"
MAIN_NODE_MODULES="${ROOT}/node_modules"

if [[ ! -d "${MAIN_NODE_MODULES}" ]]; then
  echo "[sync-deps] 主工作区未安装依赖：${MAIN_NODE_MODULES}" >&2
  exit 1
fi

if [[ ! -L "${NODE_MODULES}" || "$(readlink "${NODE_MODULES}")" != "${MAIN_NODE_MODULES}" ]]; then
  rm -rf "${NODE_MODULES}"
  ln -s "${MAIN_NODE_MODULES}" "${NODE_MODULES}"
fi

node -e '
  const [mode, WORKTREE_DIR] = process.argv.slice(1);
  console.log(JSON.stringify({ mode, WORKTREE_DIR }));
' "linked" "${WORKTREE_DIR}"
