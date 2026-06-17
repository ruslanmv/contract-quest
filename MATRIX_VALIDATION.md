# Validation
CI (`.github/workflows/deploy.yml`) runs `npm run typecheck` and `npm run build`; a failing
build blocks deployment. Local: `npm run build` (fail-closed) + a headless browser smoke test
(canvas present, zero runtime errors). Matrix Builder `mb check` may additionally gate the
allow-list per the contract.
