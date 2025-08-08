### Helios Web

Next.js 13 (pages/ router) app with Tailwind CSS (DaisyUI), NextAuth (Cognito), and Storybook.

### Quick start

1) Install dependencies

```bash
yarn install
```

2) Configure environment variables

- Copy `docs/env.example` to `.env.local` and fill in values (see docs below).

```bash
cp docs/env.example .env.local
```

3) Run the app

```bash
yarn dev
```

Open `http://localhost:3000`.

Optional:

```bash
# Run Storybook
yarn storybook
```

### Documentation

- [docs/environment-variables.md](docs/environment-variables.md) — Create `.env.local` for local dev, and set Amplify env vars for test/prod
- [docs/running.md](docs/running.md) — How to run locally, build, and run Storybook
- [docs/pages-and-styles.md](docs/pages-and-styles.md) — Create new pages, and add styles using Tailwind/DaisyUI
- [docs/components.md](docs/components.md) — Create components following the project structure
- [docs/deployment.md](docs/deployment.md) — Amplify deployment flow (client-dev auto-updates from `main`, SRE promotion to production)

For a starter template, copy [docs/env.example](docs/env.example) to `.env.local`.
