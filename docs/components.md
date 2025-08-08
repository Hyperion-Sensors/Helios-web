### Components structure

Components live under `components/` and are grouped by domain:

- `components/global/**`: shared UI (layout, navbar, tables, charts, etc.)
- `components/pages/**`: page-specific components grouped by page
- `components/carousel/**`: carousel-specific widgets

#### Creating a new component

Place new shared components in `components/global/<area>/`, or page-specific components in `components/pages/<page_name>/`.

Example:

```tsx
// components/global/buttons/primary_button.tsx
import React from "react";

type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function PrimaryButton({ children, onClick, className }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-primary ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
```

Import and use from pages or other components.

#### Hooks and data

- Data fetching and API endpoints are organized under `hooks/endpoints/**` and `hooks/queries/**`.
- Keep components focused on presentation; delegate data concerns to hooks.

#### Types and utilities

- Shared types: `utils/types/**`
- Helpers: `utils/helpers/**`

#### Auth-aware components

- Use `useSession` from `next-auth/react` to access the authenticated user when needed.
- For protected layouts, see `components/global/auth/auth_check.tsx` and `middleware.ts`.

