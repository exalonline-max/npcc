Render deploy notes for npcc

1) Render service settings
- Environment: "Web Service" (static or web as appropriate)
- Root directory: (default)
- Branch: main
- Build Command: npm ci && npm run build
- Start Command: npm run start (if applicable for a Node server)
- Package Manager: npm (important — Render defaults may be pnpm)

2) Environment variables (set in Render dashboard)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- DATABASE_URL (Postgres connection string)
- OPENAI_API_KEY (optional)
- OLLAMA_URL (optional)
- OLLAMA_MODEL (optional)
- OPENAI_MODEL (optional)

3) Prisma migrations
- Run migrations during deploy by adding a pre-build or build hook that runs:

  npx prisma migrate deploy

- Alternatively, run migrations locally and commit the generated migration files to the repo before deploying.

4) Filesystem note
- Lore is now stored in the Postgres DB (Prisma). The app will also write an exported YAML file to `lib/godrik/lore.yaml` on the server when entries change — note that on some platforms the filesystem is ephemeral. The DB is the source-of-truth.

5) Post-deploy checklist
- Ensure Render has the correct `DATABASE_URL` and Clerk keys.
- Trigger a manual deploy or wait for the push to main to start the deploy.
- If the deploy fails, paste the build logs here and I will help debug.

6) Optional (recommended)
- Protect `/api/godrik/lore` and the lore editor with Clerk (admin-only).
- Add a small CI step to run `npx prisma migrate deploy` against the production DB as part of deployment.

If you want, I can also run a small seed script to import the current `lib/godrik/lore.yaml` into the DB and push that change for you. Reply with "seed now" to proceed.

---

Manual redeploy requested: 2025-09-29T00:00:00Z
