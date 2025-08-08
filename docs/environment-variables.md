### Environment variables

Create a `.env.local` in the repo root for local development. Use `.env.example` as a template.

#### Required (server-side)

- `NEXTAUTH_URL`: e.g. `http://localhost:3000`
- `NEXTAUTH_SECRET`: strong random string
- `COGNITO_CLIENT_ID`
- `COGNITO_CLIENT_SECRET`
- `COGNITO_ISSUER`: e.g. `https://cognito-idp.<region>.amazonaws.com/<user-pool-id>`
- `COGNITO_DOMAIN` (optional but recommended for sign-out): e.g. `https://your-domain.auth.<region>.amazoncognito.com`
- `DB_HOST`: Postgres connection string used by server-side data fetching

Bug report S3 (for complaints form)
- `S3_BUG_REPORTS_BUCKET`: S3 bucket to store complaint JSON files
- `S3_BUG_REPORTS_REGION`: AWS region of the bucket (or use `AWS_REGION`)
- `S3_BUG_REPORTS_PREFIX` (optional): key prefix, default `complaints`

#### Required (client-side)

- `NEXT_PUBLIC_SERVER_ADDR`: Base URL for your backend API the frontend calls
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox token for maps
- `NEXT_PUBLIC_CLIENT_ENV`: free-form label used by visualizer models (e.g. `local`, `staging`, `prod`)

#### Amplify build/test/prod environments

Amplify injects environment variables during build. This repo uses `amplify.yml` to write selected variables into `.env.production` for Next.js:

```yaml
# amplify.yml
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

In Amplify console, set these variables for each environment (dev/test/prod) so the build can succeed.

Notes:
- Never commit `.env.local` or real secrets.
- For local development, `.env.local` is automatically loaded by Next.js.

