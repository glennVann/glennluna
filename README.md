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

For a VPS that already has the `glennluna.service` unit installed, you can
restart it with the same file:

```bash
./start-glennluna.sh restart
```

That command restarts the existing `systemd` service and prints its status.

## Quote Email Configuration

The quote form can send directly through SMTP instead of opening a local mail
app. Configure these environment variables:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@bindaddy.ca
SMTP_PASS=your-gmail-app-password
QUOTE_TO_EMAIL=info@bindaddy.ca
QUOTE_FROM_EMAIL=info@bindaddy.ca
QUOTE_REPLY_SUBJECT=We received your quote request
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
```

For Gmail, use an App Password with 2-Step Verification enabled. If the
Google account does not allow App Passwords, use Google Workspace SMTP relay
or another transactional email provider instead.

When a quote is submitted:

- the visitor must complete a Cloudflare Turnstile verification check
- the full request is sent to `QUOTE_TO_EMAIL`
- a confirmation email is also sent back to the customer email that submitted the form

## Notes

- The main profile content lives in `app/page.js`.
- Global design styles and animation helpers live in `app/globals.css`.
- Update the contact links in the page to match your real email, LinkedIn, and portfolio details.
- Project config files use `.js` as well: `next.config.js`, `eslint.config.js`, and `postcss.config.js`.
