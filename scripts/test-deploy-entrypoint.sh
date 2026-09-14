#!/usr/bin/env bash
# Fail-closed tests for the Vercel deploy entrypoint.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT="$ROOT/scripts/deploy-vercel.sh"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

out="$("$SCRIPT" --check)"
echo "$out" | grep -q "harishvudari" || fail "--check must name existing project harishvudari"
echo "$out" | grep -q "does not deploy" || fail "--check must state it does not deploy"

set +e
err="$(
  env -u VERCEL_TOKEN -u VERCEL_ORG_ID -u VERCEL_PROJECT_ID -u VERCEL_DEPLOY_HOOK_URL \
    "$SCRIPT" 2>&1
)"
status=$?
set -e
[[ "$status" -eq 1 ]] || fail "deploy without credentials must exit 1 (got ${status})"
echo "$err" | grep -q "Missing Vercel credentials" || fail "must explain missing credentials"
echo "$err" | grep -q "Will not create a project" || fail "must refuse to create a second project"

if grep -E -n "vercel( deploy)? --yes" "$SCRIPT" | grep -v "link --yes" >/dev/null; then
  fail "deploy script must not call vercel --yes (that can create a new project)"
fi

echo "test-deploy-entrypoint: all checks passed"
