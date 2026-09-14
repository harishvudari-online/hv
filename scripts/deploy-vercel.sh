#!/usr/bin/env bash
# Deploy this repo to the existing Vercel project only.
# Project: harishvudari (team harishvudari-5316s-projects)
# Production: https://www.harishvudari.online
# Never creates a second Vercel project.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

EXISTING_PROJECT="harishvudari"
EXISTING_SCOPE="harishvudari-5316s-projects"
PRODUCTION_URL="https://www.harishvudari.online"

usage() {
  cat <<'EOF'
Usage: scripts/deploy-vercel.sh [--check]

  --check   Validate the existing-project guardrails. Does not deploy.

Production deploy (CI / owner machine) requires one of:
  1) VERCEL_TOKEN + VERCEL_ORG_ID + VERCEL_PROJECT_ID
  2) VERCEL_TOKEN (links existing project harishvudari / harishvudari-5316s-projects)
  3) VERCEL_DEPLOY_HOOK_URL for that same project
EOF
}

mode="deploy"
if [[ "${1:-}" == "--check" ]]; then
  mode="check"
elif [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
elif [[ -n "${1:-}" ]]; then
  echo "Unknown argument: $1" >&2
  usage >&2
  exit 2
fi

assert_existing_project_only() {
  if [[ "$EXISTING_PROJECT" != "harishvudari" ]]; then
    echo "Refusing to deploy: project pin drifted away from harishvudari." >&2
    exit 1
  fi
  if [[ "$EXISTING_SCOPE" != "harishvudari-5316s-projects" ]]; then
    echo "Refusing to deploy: scope pin drifted away from harishvudari-5316s-projects." >&2
    exit 1
  fi
}

has_cli_ids() {
  [[ -n "${VERCEL_TOKEN:-}" && -n "${VERCEL_ORG_ID:-}" && -n "${VERCEL_PROJECT_ID:-}" ]]
}

has_cli_token() {
  [[ -n "${VERCEL_TOKEN:-}" ]]
}

has_hook() {
  [[ -n "${VERCEL_DEPLOY_HOOK_URL:-}" ]]
}

if [[ "$mode" == "check" ]]; then
  assert_existing_project_only
  if grep -R --line-regexp --fixed-string "portfolio-ui" scripts/deploy-vercel.sh >/dev/null 2>&1; then
    echo "Refusing: deploy script must not target package name portfolio-ui." >&2
    exit 1
  fi
  if ! grep -q -- "$EXISTING_PROJECT" "$ROOT/scripts/deploy-vercel.sh"; then
    echo "Missing existing project pin." >&2
    exit 1
  fi
  echo "Deploy entrypoint OK: existing project ${EXISTING_PROJECT} (${EXISTING_SCOPE}) → ${PRODUCTION_URL}"
  echo "This check does not deploy and will not create a Vercel project."
  exit 0
fi

assert_existing_project_only

if ! has_cli_token && ! has_hook; then
  echo "Missing Vercel credentials. Will not create a project." >&2
  echo "Add Production environment secrets on GitHub:" >&2
  echo "  VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID" >&2
  echo "or VERCEL_DEPLOY_HOOK_URL for project ${EXISTING_PROJECT}." >&2
  echo "Dashboard: https://vercel.com/${EXISTING_SCOPE}/${EXISTING_PROJECT}" >&2
  exit 1
fi

if has_hook && ! has_cli_token; then
  echo "Triggering existing-project deploy hook…"
  curl -fsS -X POST "$VERCEL_DEPLOY_HOOK_URL"
  echo
  echo "Hook accepted. Production: ${PRODUCTION_URL}"
  exit 0
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required for CLI deploys." >&2
  exit 1
fi

export VERCEL_TOKEN
export VERCEL_ORG_ID="${VERCEL_ORG_ID:-}"
export VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-}"

if has_cli_ids; then
  mkdir -p .vercel
  cat > .vercel/project.json <<EOF
{"orgId":"${VERCEL_ORG_ID}","projectId":"${VERCEL_PROJECT_ID}"}
EOF
else
  echo "Linking existing project ${EXISTING_PROJECT} (scope ${EXISTING_SCOPE})…"
  npx --yes vercel@59 link --yes --project "$EXISTING_PROJECT" --scope "$EXISTING_SCOPE"
fi

npx --yes vercel@59 pull --yes --environment=production
npx --yes vercel@59 build --prod
npx --yes vercel@59 deploy --prebuilt --prod

echo "Deployed existing project ${EXISTING_PROJECT} to ${PRODUCTION_URL}"
