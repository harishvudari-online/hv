#!/usr/bin/env bash
# Guardrails for the JSON blog store and API-backed UI.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA="$ROOT/src/data/blog.json"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

[[ -f "$DATA" ]] || fail "missing JSON store $DATA"
python3 - "$DATA" <<'PY'
import json, sys
path = sys.argv[1]
with open(path) as fh:
    data = json.load(fh)
posts = data.get("posts", [])
if data.get("store") != "json":
    raise SystemExit("store must be json")
if len(posts) < 6:
    raise SystemExit(f"need at least 6 posts (got {len(posts)})")
slugs = [post["slug"] for post in posts]
if len(set(slugs)) != len(slugs):
    raise SystemExit("duplicate blog slugs")
print(f"json-store: {len(posts)} posts")
PY

grep -q '/api/blog' "$ROOT/src/lib/blogApi.ts" || fail "client must call /api/blog"
grep -q "useBlogList({ preview: true })" "$ROOT/src/pages/index.tsx" || fail "homepage must load preview posts from the API"
grep -q "useBlogList()" "$ROOT/src/pages/blog/index.tsx" || fail "listing must load posts from the API"
grep -q "useBlogPost(slug)" "$ROOT/src/pages/blog/[slug].tsx" || fail "article page must load post from the API"
grep -q 'id="blog"' "$ROOT/src/pages/index.tsx" || fail "homepage must include #blog section"
grep -q 'href="/blog"' "$ROOT/src/pages/index.tsx" || fail "homepage must link More to /blog"
grep -q "moving in AI" "$ROOT/src/pages/blog/index.tsx" || fail "listing H1 must be editorial (What's moving in AI)"
grep -q "What&apos;s moving in AI" "$ROOT/src/pages/blog/index.tsx" || fail "listing H1 apostrophe must be escaped for next lint"
grep -q "Recent notes on AI tools" "$ROOT/src/pages/index.tsx" || fail "homepage blog lead must be editorial"
if grep -E "JSON (file|blog store)|blog API" "$ROOT/src/pages/blog/index.tsx" "$ROOT/src/pages/index.tsx" "$ROOT/src/pages/blog/category/[category].tsx" >/dev/null; then
  fail "visitor-facing blog copy must not mention the JSON store or blog API"
fi
[[ -f "$ROOT/src/pages/api/blog/index.ts" ]] || fail "missing list API"
[[ -f "$ROOT/src/pages/api/blog/[slug].ts" ]] || fail "missing slug API"

echo "test-blog: JSON store + API-backed UI checks passed"
