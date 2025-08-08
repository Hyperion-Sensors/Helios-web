### Pages and styles

This repo uses the Next.js `pages/` router.

#### Create a new page

1) Create a file under `pages/`, e.g. `pages/example.tsx`:

```tsx
import type { NextPage } from "next";

const ExamplePage: NextPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Example</h1>
    </div>
  );
};

export default ExamplePage;
```

2) The route will be available at `/example`.

#### Styling conventions

- Global styles: `styles/globals.css`
- Tailwind utility classes are preferred. DaisyUI themes are defined in `tailwind.config.js` (`lightTheme` and `darkTheme`).
- Keep page-level layout concerns in `components/global/layout/` where possible.

#### Theme and Tailwind

- Use Tailwind classes; extend only when necessary in `tailwind.config.js` (`extend`, `plugins`).
- Switch dark/light via `dark` class at the root.

#### File organization for page UIs

- Page entry files live in `pages/*.tsx`.
- Complex page UIs should be composed from components in `components/pages/<page_name>/**` to keep `pages/` lean.

