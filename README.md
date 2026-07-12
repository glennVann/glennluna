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

## Authentication API

The ASP.NET Core Identity API lives in `backend/` and targets .NET 10. Its
MariaDB connection string is kept outside source control with .NET user-secrets.

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=glennluna;User=YOUR_USER;Password=YOUR_PASSWORD;" --project backend/GlennLuna.Api.csproj
dotnet tool restore
dotnet tool run dotnet-ef database update --project backend/GlennLuna.Api.csproj
dotnet run --project backend/GlennLuna.Api.csproj --urls http://localhost:5000
```

Identity endpoints are under `/api/auth`, including `/register`, `/login`,
`/refresh`, `/manage/info`, and the authenticated `/me` endpoint. Login returns
an access token for `Authorization: Bearer <token>` requests.

Identity requires email confirmation before login. Configure `SMTP_HOST`,
`SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and optionally
`AUTH_FROM_EMAIL`. Registration sends a confirmation link automatically; use
`POST /api/auth/resendConfirmationEmail` to resend it.
The backend automatically loads missing settings from the repository root
`.env`, so it can reuse the same SMTP configuration as the Next.js service.
System environment variables and .NET user-secrets take priority.
The Next.js login proxy connects to the backend at `AUTH_API_URL`, which
defaults to `http://127.0.0.1:5000` for the combined VPS service.
Set `PUBLIC_APP_URL=https://glennluna.bindaddy.ca` so confirmation emails use
the public site instead of the backend's internal loopback address.

## Build

```bash
npm run build
npm start
```

The app is configured to run on port `3003` by default.

## VPS Start Script

Use the root script below if you want `systemd` to start the app directly:

```bash
dotnet build backend/GlennLuna.Api.csproj --configuration Release
./start-glennluna.sh
```

It runs the Next.js frontend on `0.0.0.0:3003` and the ASP.NET backend on
`127.0.0.1:5000`. It expects both production builds to exist. Override the
backend listener with `ASPNETCORE_URLS` when needed.

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
