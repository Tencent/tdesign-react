#!/usr/bin/env bash

# 从 PR 正文中解析 StackBlitz Demo URL，供审查运行时内部记录

set -euo pipefail

N="${1:-}"
if [[ ! "${N}" =~ ^[0-9]+$ ]]; then
  echo "Usage: record-stackblitz.sh <pr>" >&2
  exit 1
fi

body="$(
  gh pr view "${N}" \
    --repo Tencent/tdesign-react \
    --json body \
    --jq '.body // ""'
)"

normalize_candidate() {
  local value="$1"
  value="${value//&amp;/&}"
  while [[ "${value}" == *[\)\]\}\>.,\;:\'\"] ]]; do
    value="${value%?}"
  done
  printf '%s' "${value}"
}

is_stackblitz() {
  local url="$1" rest host path
  [[ "${url}" =~ ^https?:// ]] || return 1
  rest="${url#*://}"
  if [[ "${rest%%/*}" == *"@"* ]]; then
    rest="${rest#*@}"
  fi
  host="${rest%%/*}"
  host="${host%%:*}"
  host="$(printf '%s' "${host}" | tr '[:upper:]' '[:lower:]')"
  host="${host#www.}"
  [[ "${host}" == "stackblitz.com" ]] || return 1

  if [[ "${rest}" == */* ]]; then
    path="/${rest#*/}"
  else
    path="/"
  fi
  path="${path%%\?*}"
  path="${path%%#*}"
  path="$(printf '%s' "${path}" | tr '[:upper:]' '[:lower:]')"
  [[ "${path}" =~ ^/(edit|github)/[^/]+ ]]
}

demo_url=""
while IFS= read -r candidate; do
  [[ -n "${candidate}" ]] || continue
  normalized="$(normalize_candidate "${candidate}")"
  if is_stackblitz "${normalized}"; then
    demo_url="${normalized}"
    break
  fi
done < <(printf '%s\n' "${body}" | grep -oE 'https?://[^[:space:]<>"'"'"']+' || true)

if [[ -n "${demo_url}" ]]; then
  printf '%s' "${demo_url}"
fi
