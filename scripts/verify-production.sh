#!/usr/bin/env bash
# Confirm the existing production host is serving this site.
# Deploy hooks return before Vercel finishes the build, so retry until the
# editorial blog copy is live (or time out).
set -euo pipefail

PRODUCTION_URL="${PRODUCTION_URL:-https://www.harishvudari.online}"
ALIAS_URL="${ALIAS_URL:-https://harishvudari.vercel.app}"
ATTEMPTS="${VERIFY_ATTEMPTS:-12}"
SLEEP_SECONDS="${VERIFY_SLEEP_SECONDS:-8}"

fail() {
  echo "$*" >&2
  exit 1
}

fetch() {
  local url="$1"
  local dest="$2"
  local code
  code="$(curl -fsSL -o "$dest" -w "%{http_code}" "$url")" || return 1
  [[ "$code" == "200" ]]
}

check_homepage() {
  local url="$1"
  local tmp="$2"
  fetch "$url" "$tmp" || return 1
  grep -q "Harish Vudari" "$tmp" || return 1
  grep -q "Recent notes on AI tools" "$tmp" || return 1
  if grep -q "Auto-blogging briefings" "$tmp"; then
    return 1
  fi
  return 0
}

check_blog() {
  local origin="$1"
  local tmp="$2"
  fetch "${origin}/blog" "$tmp" || return 1
  grep -q "moving in AI" "$tmp" || return 1
  if grep -q "Auto-blogging briefings" "$tmp" || grep -q "loaded through the blog API" "$tmp"; then
    return 1
  fi
  return 0
}

check_api() {
  local origin="$1"
  local tmp="$2"
  fetch "${origin}/api/blog" "$tmp" || return 1
  python3 - "$tmp" <<'PY'
import json, sys
with open(sys.argv[1]) as fh:
    data = json.load(fh)
if data.get("count", 0) < 1 or not data.get("posts"):
    raise SystemExit(1)
PY
}

attempt=1
tmp_home="$(mktemp)"
tmp_blog="$(mktemp)"
tmp_api="$(mktemp)"
trap 'rm -f "$tmp_home" "$tmp_blog" "$tmp_api"' EXIT

while (( attempt <= ATTEMPTS )); do
  echo "Verify attempt ${attempt}/${ATTEMPTS}…"
  if check_homepage "$PRODUCTION_URL" "$tmp_home" \
    && check_homepage "$ALIAS_URL" "$tmp_home" \
    && check_blog "$PRODUCTION_URL" "$tmp_blog" \
    && check_blog "$ALIAS_URL" "$tmp_blog" \
    && check_api "$PRODUCTION_URL" "$tmp_api" \
    && check_api "$ALIAS_URL" "$tmp_api"; then
    echo "OK ${PRODUCTION_URL}"
    echo "OK ${ALIAS_URL}"
    echo "OK ${PRODUCTION_URL}/blog"
    echo "OK ${PRODUCTION_URL}/api/blog"
    echo "Production is live on the existing Vercel project."
    exit 0
  fi
  if (( attempt == ATTEMPTS )); then
    break
  fi
  sleep "$SLEEP_SECONDS"
  attempt=$((attempt + 1))
done

echo "Last homepage snippet:" >&2
grep -oE '.{0,40}(moving in AI|Auto-blogging|Recent notes|JSON file|blog API).{0,40}' "$tmp_home" >&2 || true
echo "Last /blog snippet:" >&2
grep -oE '.{0,40}(moving in AI|Auto-blogging|JSON file|blog API).{0,40}' "$tmp_blog" >&2 || true
fail "Production did not serve the editorial blog copy in time. Homepage, /blog, and /api/blog must be 200 on both hosts."
