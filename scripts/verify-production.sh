#!/usr/bin/env bash
# Confirm the existing production host is serving this site.
set -euo pipefail

PRODUCTION_URL="${PRODUCTION_URL:-https://www.harishvudari.online}"
ALIAS_URL="${ALIAS_URL:-https://harishvudari.vercel.app}"

check_host() {
  local url="$1"
  local tmp
  tmp="$(mktemp)"
  local code
  code="$(curl -fsSL -o "$tmp" -w "%{http_code}" "$url")"
  if [[ "$code" != "200" ]]; then
    echo "Expected HTTP 200 from ${url}, got ${code}" >&2
    rm -f "$tmp"
    exit 1
  fi
  if ! grep -q "Harish Vudari" "$tmp"; then
    echo "Production HTML from ${url} did not include expected title text." >&2
    rm -f "$tmp"
    exit 1
  fi
  rm -f "$tmp"
  echo "OK ${url}"
}

check_host "$PRODUCTION_URL"
check_host "$ALIAS_URL"
echo "Production is live on the existing Vercel project."
