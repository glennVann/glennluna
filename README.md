# Glenn Luna Developer Profile

A professional software developer profile web app built with Next.js 16, React 19, and Tailwind CSS 4.

## Stack

- Next.js 16 App Router
- React 19
- JavaScript
- Tailwind CSS 4

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3003`.

## Build

```bash
npm run build
npm start
```

The app is configured to run on port `3003` by default.

## VPS Start Script

Use the root script below if you want `systemd` to start the app directly:

```bash
./start-glennluna.sh
```

It runs the app in production mode on `0.0.0.0:3003` and expects `.next` to
already exist from `npm run build`.

## Notes

- The main profile content lives in `app/page.js`.
- Global design styles and animation helpers live in `app/globals.css`.
- Update the contact links in the page to match your real email, LinkedIn, and portfolio details.
- Project config files use `.js` as well: `next.config.js`, `eslint.config.js`, and `postcss.config.js`.
