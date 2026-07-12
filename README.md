# Luby — Lullaby Library

A small full-stack web app for browsing and listening to a curated library of lullabies.
Anyone can browse and play tracks. With an account you can **like** lullabies (which form
your **Liked** playlist) and build your own **playlists**. Guests who tap _Like_ or
_Add to playlist_ get a sign-in / sign-up popup.

## Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React + Vite + TypeScript SPA, RTK Query, plain CSS (pastel themes) |
| Backend  | Express + TypeScript REST API (layered: routes → controllers → services) |
| Database | PostgreSQL + Prisma |
| Auth     | Custom JWT (bcrypt password hashing + Bearer tokens) |
| Run      | Docker Compose (`db` + `backend` + `frontend`) |

The frontend is a static SPA served by nginx, which also reverse-proxies `/api` and
`/media` to the backend — so the browser talks to a single origin (no CORS).

## Quick start

```bash
cp .env.example .env        # optional; sensible defaults are built in
docker compose up --build
```

Then open **http://localhost:8080**.

On first start the backend syncs the schema to Postgres (`prisma db push`) and seeds the
catalog from the markdown files in `backend/media/` (idempotent — safe to re-run).

## Project layout

```
Root/
├── docker-compose.yml          # db + backend + frontend
├── backend/                    # Express API
│   ├── prisma/schema.prisma    # data model (single source of truth)
│   ├── prisma/seed.ts          # parses media/*.md → DB rows
│   ├── media/                  # lullaby .mp3 + .md metadata (served at /media)
│   └── src/
│       ├── routes/  controllers/  services/   # layered request handling
│       ├── middleware/{auth,validate,error}.ts
│       └── utils/{jwt,password,http-error}.ts
└── frontend/                   # React SPA
    ├── nginx.conf              # SPA + proxy to backend
    └── src/
        ├── store/{store,api}.ts          # RTK Query (no Redux slices)
        ├── context/{Auth,Player,Theme}.tsx
        ├── components/  pages/
        └── lib/  styles/globals.css
```

## Data model

- **User** — account (email, hashed password, display name).
- **Category** — lullaby grouping (e.g. _Animals_, _Ocean & Water_).
- **Lullaby** — a track (title, style, tempo, duration, lyrics, tags, audio URL).
- **Playlist** / **PlaylistItem** — user playlists and their tracks.
- **Like** — a user↔lullaby like. The **Liked** playlist is a virtual view over this table.

## API

Public:
- `GET /api/categories`
- `GET /api/lullabies?category=<slug>&search=<text>`
- `GET /api/lullabies/:id`
- `GET /media/<slug>.mp3`

Auth:
- `POST /api/auth/register` `{ email, password, displayName }` → `{ user, token }`
- `POST /api/auth/login` `{ email, password }` → `{ user, token }`
- `GET /api/auth/me` _(Bearer token)_

Likes _(Bearer token)_ — the Liked playlist:
- `GET /api/me/likes` · `PUT /api/me/likes/:lullabyId` · `DELETE /api/me/likes/:lullabyId`

Playlists _(Bearer token)_:
- `GET /api/me/playlists` · `POST /api/me/playlists` `{ name }`
- `GET /api/me/playlists/:id` · `PATCH /api/me/playlists/:id` `{ name }` · `DELETE /api/me/playlists/:id`
- `POST /api/me/playlists/:id/items` `{ lullabyId }` · `DELETE /api/me/playlists/:id/items/:lullabyId`

## Tests

Backend integration tests (Vitest + Supertest) exercise the API over HTTP against a
throwaway `luby_test` database. They run via a Docker Compose `test` profile, isolated
from the dev stack:

```bash
docker compose --profile test run --rm --build test   # builds, seeds a test DB, runs vitest
docker compose --profile test down                    # clean up the test containers
```

The run exits non-zero if any test fails. Coverage: auth (register/login, duplicate,
validation, token guards), catalog (list/filter/search/404), likes, and the full
playlist lifecycle (create/add/rename/remove/delete + ownership isolation).

## Local development (without Docker)

You need a Postgres instance (e.g. `docker compose up db`).

```bash
# backend
cd backend
cp ../.env.example .env   # set DATABASE_URL + JWT_SECRET
npm install
npm run db:push && npm run seed
npm run dev               # http://localhost:4000

# frontend (separate terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173 (proxies /api + /media to :4000)
```
