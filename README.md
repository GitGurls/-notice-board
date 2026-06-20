# Notice Board

A campus notice board built for the Reno Platforms web development internship assignment.
Full create / read / update / delete, with server-side validation and Urgent-first ordering
done in the database query.

**Live app:** _add your Vercel URL here after deploying_
**Repo:** _add your GitHub URL here_

## Stack

- Next.js 14 (Pages Router)
- Prisma ORM
- MySQL-compatible hosted database (TiDB Cloud)
- Tailwind CSS
- Deployed on Vercel (Hobby/free tier)

## Project structure

```
pages/
  index.js                 Notices list (cards, edit/delete)
  notices/new.js            Add notice form
  notices/[id]/edit.js      Edit notice form (loads existing values)
  api/notices/index.js      GET (list, Urgent-first) + POST (create)
  api/notices/[id].js       GET (one) + PUT (update) + DELETE
components/
  NoticeCard.js              Card UI with confirm-before-delete
  NoticeForm.js              Shared form used by both new + edit
lib/
  prisma.js                  Prisma client singleton
  constants.js                Category/priority options shared by client + server
  validateNotice.js           Server-side validation, used by both API routes
prisma/
  schema.prisma                Notice model
```

## Running locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a free hosted database** (pick one):
   - [TiDB Cloud](https://tidbcloud.com) (MySQL-compatible, recommended) — create a free Serverless cluster, then copy the connection string from the cluster's "Connect" panel.
   - Neon or Supabase (Postgres) — if you use one of these instead, change `provider = "mysql"` to `provider = "postgresql"` in `prisma/schema.prisma`.

3. **Set your environment variable**
   ```bash
   cp .env.example .env
   # paste your connection string into DATABASE_URL inside .env
   ```

4. **Push the schema to your database**
   ```bash
   npx prisma db push
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Deploying

1. Push this repo to a **public** GitHub repository (with real, incremental commits — not a single "initial commit").
2. Import the repo into [Vercel](https://vercel.com) (Hobby/free tier).
3. Add the `DATABASE_URL` environment variable in the Vercel project settings (same value as your local `.env`).
4. Deploy. Make sure the deployment is public and opens without logging in.

## Notes on a few design decisions

- **Urgent-first ordering** happens in `prisma.notice.findMany({ orderBy: [{ priority: "desc" }, ...] })`. Storing priority as the string `"Urgent"` / `"Normal"` works for this because `"Urgent"` sorts after `"Normal"` alphabetically, so a descending sort naturally puts every Urgent notice above every Normal one — no extra mapping needed.
- **Server-side validation** lives in `lib/validateNotice.js` and is called from both the create and update API routes, independently of the browser-side checks in the form. Required fields and the date are re-checked there because client-side validation can always be bypassed (e.g. by calling the API directly).
- **Image (bonus)** is implemented by converting the chosen file to a base64 data URL in the browser and storing it as text in the database. This avoids needing a separate paid file-storage service while still meeting the "optional image" requirement — the tradeoff is that database rows are larger than they'd be with a real object-storage bucket (see below).

## What I'd improve with more time

Store the image in object storage (e.g. Vercel Blob or an S3-compatible bucket) and save only the URL in the
database, instead of embedding the image as a base64 string in the `Notice` row. That would keep rows small,
let images be cached/served by a CDN, and avoid the practical size limit base64-in-database imposes.

## Where and how AI was used

This project was built with the help of Claude (Anthropic). AI was used to scaffold the Next.js Pages Router
structure, write the Prisma schema, generate the API routes and React components, and draft this README. I
reviewed the generated code, ran it, and adjusted it before submitting.
