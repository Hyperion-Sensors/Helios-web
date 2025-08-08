### Running locally

Prereqs:
- Node.js LTS and Yarn
- `.env.local` configured (see `docs/environment-variables.md`)

Install dependencies:

```bash
yarn install
```

Start dev server:

```bash
yarn dev
```

Open `http://localhost:3000`.

### Build and start

```bash
yarn build
yarn start
```

### Storybook

```bash
yarn storybook
```

### Tailwind and DaisyUI

Tailwind is configured in `tailwind.config.js` with DaisyUI themes. Content paths include `pages/**` and `components/**`.

### Amplify build (CI)

Amplify uses `amplify.yml` to install, inject env vars, and build the Next.js app. Ensure environment variables are set in the Amplify console.

