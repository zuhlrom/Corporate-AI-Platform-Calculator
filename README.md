# Corporate AI Platform Calculator

Browser SPA for the Landi / fenaco **Digital Assistant** TCO and value-case model. The numeric engine reproduces [`Digital_Assistant_Szenario_Berechnung_v11-1.xlsx`](https://github.com/zuhlrom/Corporate-AI-Platform-Calculator) (sheet logic for usage, implementation, OPEX, benefits, and value case).

**Repository:** https://github.com/zuhlrom/Corporate-AI-Platform-Calculator

## Workbook

The reference file is vendored for offline demos:

- `public/Digital_Assistant_Szenario_Berechnung_v11-1.xlsx`

## Scripts

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Vite dev server (Port 5173) |
| `npm run dev:5174` | Dev-Server auf **5174**, falls 5173 blockiert ist |
| `npm run build` | Typecheck + production bundle |
| `npm run test` | Vitest — regression checks against the v11-1 workbook |
| `npm run lint` | ESLint |

## Stack

Vite 8, React 19, TypeScript (strict), Tailwind v4, shadcn-style UI base, calculation layer under `src/calc/` (pure `computeEngine`).

## Roadmap

Zustand + full CRUD UI, ExcelJS import/export, charts, and i18n are planned on top of the engine that is locked by tests today.

## Licence

Internal / private unless otherwise stated.
