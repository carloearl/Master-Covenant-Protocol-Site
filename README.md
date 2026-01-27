# Base44 Preview Template for MicroVM sandbox

This template is used by the server to preview user-apps.

## user files
server creates the user-app files in the __components__, __pages__ folders

## server injected data
server injects app related data to __app.config.js__, which is used by App.jsx to render the components in the files.

## Base44 workspace export
Run `npm run migrate:base44` to generate a `base44-workspace/` folder containing:
- `__pages__` (copied from `src/pages`)
- `__components__` (copied from `src/components`)
- supporting directories (`api`, `assets`, `config`, `content`, `entities`, `hooks`, `lib`, `public`, `styles`, `supabase`, `utils`)
- `Layout.jsx` and `globals.css` (copied from `src/`)
- `__app.config.js__` (auto-generated file index)
