#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This script must be run inside a Git repository." >&2
  exit 1
fi

BASE_COMMIT="${1:-}"
OUTPUT_FILE="${2:-photodisplay.patch}"

if [[ -z "${BASE_COMMIT}" ]]; then
  BASE_COMMIT=$(git rev-list --max-parents=0 HEAD | tail -n 1)
  >&2 echo "No base commit supplied; defaulting to repository root ${BASE_COMMIT}."
  >&2 echo "Pass an explicit base (e.g. origin/main or a commit hash) to limit the patch scope."
fi

if ! git rev-parse --verify "${BASE_COMMIT}" >/dev/null 2>&1; then
  echo "Base commit '${BASE_COMMIT}' is not valid. Provide a branch name or commit hash." >&2
  exit 1
fi

git format-patch --stdout "${BASE_COMMIT}..HEAD" > "${OUTPUT_FILE}"

PATCH_SIZE=$(wc -c < "${OUTPUT_FILE}")
echo "Wrote $(git rev-list --count "${BASE_COMMIT}..HEAD") commit(s) to ${OUTPUT_FILE} (${PATCH_SIZE} bytes)."

