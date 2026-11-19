#!/usr/bin/env bash

# 移除审查 worktree、本地 pr-<N>、临时 remote 等

set -euo pipefail

N="${1:?usage: cleanup-review.sh <N> [test-path]}"
TEST_PATH="${2:-${TEST_PATH:-}}"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$(dirname "${SCRIPT_DIR}")"
STATE_FILE="${RUNTIME_DIR}/restore-state.env"

if [[ ! -f "${STATE_FILE}" ]]; then
  echo "[cleanup-review] 缺少运行状态：${STATE_FILE}" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "${STATE_FILE}"
: "${ROOT:?ROOT missing from restore-state.env}"
: "${WORKTREE_DIR:?WORKTREE_DIR missing from restore-state.env}"
cd "${ROOT}"

if [[ -f "${RUNTIME_DIR}/dev.pid" ]]; then
  DEV_PID="$(cat "${RUNTIME_DIR}/dev.pid")"
  if kill -0 "${DEV_PID}" 2>/dev/null; then
    pkill -TERM -P "${DEV_PID}" 2>/dev/null || true
    kill "${DEV_PID}" 2>/dev/null || true
  fi
fi

if [[ -n "${TEST_PATH}" && -d "${WORKTREE_DIR}" ]]; then
  case "${TEST_PATH}" in
    /*) rm -f -- "${TEST_PATH}" ;;
    *) rm -f -- "${WORKTREE_DIR}/${TEST_PATH}" ;;
  esac
fi

if [[ -d "${WORKTREE_DIR}" ]]; then
  git worktree remove --force "${WORKTREE_DIR}" 1>&2 || rm -rf "${WORKTREE_DIR}"
  git worktree prune >/dev/null 2>&1 || true
  rmdir "$(dirname "${WORKTREE_DIR}")" >/dev/null 2>&1 || true
fi

git branch -D "pr-${N}" 1>&2 || true
git remote remove "pr-${N}" 2>/dev/null || true
rm -rf "${RUNTIME_DIR}"

node -e '
  const [WORKTREE_DIR, removedBranch] = process.argv.slice(1);
  console.log(JSON.stringify({ WORKTREE_DIR, removedBranch, cleaned: true }));
' "${WORKTREE_DIR}" "pr-${N}"
