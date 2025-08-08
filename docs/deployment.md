### Deployment strategy (Amplify)

This app is deployed with AWS Amplify using the `amplify.yml` in the repo root. Today, every commit to `main` auto-builds and updates all client-dev environments. After validation, changes will be promoted to production by the SRE team (future process below).

#### How it works today

Architecture: single-tenant
- Each Amplify App/environment represents a single tenant (client) of Helios Web.
- Every tenant is connected to its own Helios Server API layer hosted on AWS Lightsail.
- Tenants are isolated via environment-specific configuration, primarily:
  - `NEXT_PUBLIC_SERVER_ADDR` — base URL of the tenant’s Helios Server API (Lightsail)
  - Auth and data backends (`COGNITO_*`, `DB_HOST`) provisioned per tenant

- Each client-dev environment is a separate Amplify App connected to this repository and the `main` branch with auto-build enabled.
- On push to `main`, all connected client-dev apps build in parallel using `amplify.yml`:

```yaml
# amplify.yml (excerpt)
frontend:
  phases:
    build:
      commands:
        - env | grep -e NEXTAUTH_URL >> .env.production
        - env | grep -e DB_HOST >> .env.production
        - env | grep -e COGNITO_CLIENT_ID -e COGNITO_CLIENT_SECRET -e COGNITO_ISSUER >> .env.production
        - env | grep -e NEXTAUTH_SECRET >> .env.production
        - env | grep -e NEXT_PUBLIC_ >> .env.production
        - yarn run build
```

- Environment variables are set per Amplify App in the console (see `docs/environment-variables.md`).
- Output is served from the Amplify hosting URL or a custom domain per client.

#### Adding a new client-dev environment

1) In AWS Amplify console, create a new App and connect it to the `Hyperion/Helios-web` repo, branch `main`.
2) Enable auto-build on commits.
3) Configure Environment variables for this client (minimum):
   - Server-side: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `COGNITO_CLIENT_ID`, `COGNITO_CLIENT_SECRET`, `COGNITO_ISSUER`, `DB_HOST`
   - Client-side: `NEXT_PUBLIC_SERVER_ADDR` (points to tenant’s Lightsail Helios Server), `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_CLIENT_ENV`
4) (Optional) Configure a custom domain and rewrites as needed.
5) Save and deploy. On the next commit to `main`, this client-dev env will auto-update.

#### Validation flow

- Developers merge to `main` via PR. Branch protection and reviews recommended.
- Amplify auto-builds all client-dev environments.
- QA validates on one or more client-dev URLs.

#### Promotion to production (future, SRE-owned)

Two common options; SRE will standardize one:

Option A — Release branches/tags (recommended)
- Production Amplify apps track `release/*` or tags (e.g., `v*`).
- After QA passes on client-dev, SRE creates a release tag or merges to `release/prod` → triggers prod deploy.
- Rollback: retag to previous version or redeploy previous build in Amplify.

Option B — Commit-SHA promote
- SRE triggers a redeploy on production Amplify apps pinned to the tested commit SHA built on `main` (no new builds).
- Rollback: redeploy a previous successful build.

Current interim
- If production apps are already connected: SRE manually deploys the vetted commit (via tag or redeploy in console).
- If not yet connected: SRE will set them up as above and adopt Option A.

#### Operational notes

- Ensure `NEXTAUTH_URL` matches the environment’s public URL; mismatches often cause auth issues/redirect loops.
- Each client-dev environment needs its own Cognito values and public tokens.
- Builds run in parallel across client-dev apps; watch Amplify build logs for failures.
- Never commit secrets; manage via Amplify environment variables.

References
- `amplify.yml` — build commands
- `docs/environment-variables.md` — required variables per environment
- `docs/running.md` — local build/run

