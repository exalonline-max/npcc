# NPCC - D&D Tools Prototype

Scaffolded Next.js + Clerk + Prisma prototype.

Quick start (macOS / bash):

1. Install dependencies

```bash
cd /Users/larente/npcc
npm install
```

2. Initialize environment

Create a `.env` with Clerk and database URLs. For local dev with SQLite, add:

```bash
DATABASE_URL="file:./dev.db"
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

3. Run Prisma migrate and start dev server

```bash
npm run prisma:migrate
npm run dev
```

Open http://localhost:3000

## Deploying to Render (guide)

You can connect this repository to Render and run the production build there. High-level steps:

1. Push your local repo to GitHub (create a remote and push main):

```bash
git init
git add .
git commit -m "Initial scaffold"
git branch -M main
git remote add origin git@github.com:<your-org-or-user>/<repo>.git
git push -u origin main
```

2. On Render (https://render.com) create a new Web Service and connect your GitHub repo.
	- Choose Environment: `Node` or `Node (Other)` with the `npm` build commands.
	- Build command: `npm run build`
	- Start command: `npm run start`

Note: Render defaults to `pnpm` when detecting a lockfile. This project uses `package-lock.json`/`npm`. In the Render service settings set "Package Manager" to `npm` (or remove `pnpm-lock.yaml` if present) so Render runs `npm ci`/`npm run build` instead of `pnpm`.
	- Set the Branch to `main` (or your branch).

3. Create a Managed Postgres on Render (if you want persistent DB), then copy the DATABASE_URL for the DB into service environment variables.

4. Add the Clerk environment variables in Render service settings (Environment -> Environment Variables):
	- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
	- CLERK_PUBLISHABLE_KEY (optional)
	- CLERK_SECRET_KEY
	- CLERK_JWT_KEY
	- DATABASE_URL

5. Prisma on Render: in production you should run migrations using `prisma migrate deploy` during the deploy lifecycle. Two options:
	- Add a `predeploy` script in Render that runs `npx prisma migrate deploy` (recommended for managed DB).
	- Or run `npx prisma migrate deploy` manually in the Render shell once.

6. Visit your Render service URL. Tail logs from the Render dashboard to troubleshoot runtime errors. You can also run the same `curl` checks or open the browser console.
# npcc
