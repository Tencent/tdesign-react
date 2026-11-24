#!/usr/bin/env bash

# 为 PR 创建独立 worktree 和审查运行时

set -euo pipefail

N="${1:?usage: prepare-review.sh <N>}"
REPO="Tencent/tdesign-react"

MAIN_ROOT="$(git worktree list --porcelain | sed -n 's/^worktree //p' | head -n 1)"
if [[ -z "${MAIN_ROOT}" ]]; then
  echo "[prepare-review] 无法定位主工作区" >&2
  exit 1
fi
cd "${MAIN_ROOT}"

GIT_COMMON_DIR="$(git rev-parse --path-format=absolute --git-common-dir)"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
RUNTIME_DIR="${GIT_COMMON_DIR}/tdesign-code-review/pr-${N}"
WORKTREE_DIR="$(dirname "${MAIN_ROOT}")/tdesign-react-reviews/pr-${N}"

if git show-ref --verify --quiet "refs/heads/pr-${N}"; then
  echo "[prepare-review] 本地分支 pr-${N} 已存在，请先完成或清理上一次审查" >&2
  exit 1
fi
if [[ -e "${RUNTIME_DIR}" ]]; then
  echo "[prepare-review] 审查运行时已存在：${RUNTIME_DIR}，请先清理上一次审查" >&2
  exit 1
fi
if [[ -e "${WORKTREE_DIR}" ]]; then
  echo "[prepare-review] 审查 worktree 已存在：${WORKTREE_DIR}，请先清理上一次审查" >&2
  exit 1
fi

mkdir -p "${RUNTIME_DIR}" "$(dirname "${WORKTREE_DIR}")"
cp -R "${SKILL_DIR}/scripts" "${RUNTIME_DIR}/"

{
  printf 'ROOT=%q\n' "${MAIN_ROOT}"
  printf 'WORKTREE_DIR=%q\n' "${WORKTREE_DIR}"
  printf 'RUNTIME_DIR=%q\n' "${RUNTIME_DIR}"
} > "${RUNTIME_DIR}/restore-state.env"

rollback_prepare() {
  local exit_code=$?
  trap - ERR
  set +e
  if [[ -d "${WORKTREE_DIR}" ]]; then
    git worktree remove --force "${WORKTREE_DIR}" >/dev/null 2>&1 || rm -rf "${WORKTREE_DIR}"
    git worktree prune >/dev/null 2>&1
    rmdir "$(dirname "${WORKTREE_DIR}")" >/dev/null 2>&1 || true
  fi
  git branch -D "pr-${N}" >/dev/null 2>&1
  git remote remove "pr-${N}" >/dev/null 2>&1
  rm -rf "${RUNTIME_DIR}"
  exit "${exit_code}"
}
trap rollback_prepare ERR

git fetch origin \
  "+refs/heads/develop:refs/remotes/origin/develop" \
  "+pull/${N}/head:refs/heads/pr-${N}" 1>&2

read -r HEAD_OWNER HEAD_REPO HEAD_REF <<< "$(
  gh pr view "${N}" --repo "${REPO}" \
    --json headRepositoryOwner,headRepository,headRefName \
    --jq '[.headRepositoryOwner.login // "", .headRepository.name // "", .headRefName // ""] | @tsv'
)"

if [[ -n "${HEAD_OWNER}" && -n "${HEAD_REPO}" && -n "${HEAD_REF}" ]]; then
  if [[ "$(git remote get-url origin)" == git@github.com:* ]]; then
    HEAD_URL="git@github.com:${HEAD_OWNER}/${HEAD_REPO}.git"
  else
    HEAD_URL="https://github.com/${HEAD_OWNER}/${HEAD_REPO}.git"
  fi
  git remote remove "pr-${N}" 2>/dev/null || true
  git remote add "pr-${N}" "${HEAD_URL}"
  git config "branch.pr-${N}.remote" "pr-${N}"
  git config "branch.pr-${N}.merge" "refs/heads/${HEAD_REF}"
  git config "branch.pr-${N}.pushRemote" "pr-${N}"
  git config "remote.pr-${N}.push" "refs/heads/pr-${N}:refs/heads/${HEAD_REF}"
  echo "[prepare-review] 已绑定 pr-${N} 上游 -> ${HEAD_URL} (${HEAD_REF})" >&2
else
  echo "[prepare-review] 未获取到 PR 源分支信息，跳过 push 目标绑定" >&2
fi

git worktree add "${WORKTREE_DIR}" "pr-${N}" 1>&2
git -C "${WORKTREE_DIR}" submodule update --init packages/common 1>&2
bash "${RUNTIME_DIR}/scripts/review/sync-deps.sh" >/dev/null
trap - ERR

node -e '
  const [WORKTREE_DIR, RUNTIME_DIR, PR_BRANCH] = process.argv.slice(1);
  console.log(JSON.stringify({ WORKTREE_DIR, RUNTIME_DIR, PR_BRANCH }));
' "${WORKTREE_DIR}" "${RUNTIME_DIR}" "pr-${N}"
