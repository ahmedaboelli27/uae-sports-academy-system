# UAE Sports Academy Management System

Scaffold for a multi-portal sports academy management platform (public website, parent, coach, and admin portals).

## Tech stack

- React 18 + Vite 6 + TypeScript
- Yarn
- Tailwind CSS (shadcn/ui-compatible)
- React Router 7
- Zustand, TanStack Query, React Hook Form, Zod, Axios, Recharts, i18next

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Yarn](https://yarnpkg.com/) 1.x or Berry

## Getting started

```bash
# Install dependencies
yarn install

# Copy environment template
cp .env.example .env

# Start development server
yarn dev
```

Open [http://localhost:5173](http://localhost:5173).

### Mock login

1. Go to `/auth/login`
2. Choose a demo role (Parent, Coach, Accountant, Admin, Super Admin)
3. Click **Sign in (mock)** to enter the matching portal

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `yarn dev`     | Start dev server         |
| `yarn build`   | Production build         |
| `yarn preview` | Preview production build |
| `yarn lint`    | Run ESLint               |

## Project structure

```
src/
  app/           # Router, layouts, providers
  components/    # UI, layout, shared
  features/      # Feature-based pages (auth, public, parent, coach, admin)
  services/      # API client & mock services
  store/         # Zustand stores
  types/         # TypeScript domain types
  data/          # Mock data
  i18n/          # English & Arabic translations
```

## Path alias

`@/` maps to `src/` (see `vite.config.ts` and `tsconfig.app.json`).

## Locales

English (LTR) and Arabic (RTL) via i18next. Use the language toggle in the top bar.

## Export / zip the project

From PowerShell (Windows):

```powershell
Compress-Archive -Path "z:\Projects\uae-sports-academy-system\*" -DestinationPath "z:\Projects\uae-sports-academy-system.zip" -Force
```

Exclude `node_modules` for a smaller archive:

```powershell
$src = "z:\Projects\uae-sports-academy-system"
$dest = "z:\Projects\uae-sports-academy-system-source.zip"
Get-ChildItem $src -Exclude node_modules,dist | Compress-Archive -DestinationPath $dest -Force
```

## License

Private — academy internal use.
