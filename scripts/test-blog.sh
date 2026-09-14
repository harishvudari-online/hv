#!/usr/bin/env bash
# Guardrails for the AI News blog data used by the homepage preview.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA="$ROOT/src/data/blog.ts"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

[[ -f "$DATA" ]] || fail "missing $DATA"

mapfile -t slugs < <(grep -oE 'slug: "[^"]+"' "$DATA" | sed 's/slug: "//;s/"$//')
count="${#slugs[@]}"
[[ "$count" -ge 6 ]] || fail "need at least 6 posts for homepage preview (got ${count})"

unique="$(printf '%s\n' "${slugs[@]}" | sort -u | wc -l | tr -d ' ')"
[[ "$unique" -eq "$count" ]] || fail "duplicate blog slugs"

for page in \
  "$ROOT/src/pages/blog/index.tsx" \
  "$ROOT/src/pages/blog/[slug].tsx" \
  "$ROOT/src/pages/index.tsx"
do
  [[ -f "$page" ]] || fail "missing $page"
done

grep -q 'id="blog"' "$ROOT/src/pages/index.tsx" || fail "homepage must include #blog section"
grep -q 'href="/blog"' "$ROOT/src/pages/index.tsx" || fail "homepage must link More to /blog"

echo "test-blog: ${count} unique posts, listing and article routes present"
