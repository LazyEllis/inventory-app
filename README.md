# Yomu Manga Inventory

A minimalist Express + PostgreSQL application to catalog manga and related metadata (authors, roles, magazines, demographics, genres, status). Server‑rendered with EJS and a lightweight MVC-style structure.

## Features

- CRUD for: Authors, Roles, Status, Demographics, Genres, Magazines, Mangas.
- Relational linking (many-to-many: manga/authors with roles, manga/genres).
- Manga list filtering via query (e.g. `?author=1`, `?genre=3`, `?status=2`).
- Dynamic form population (selection data fetched per route).
- Form validation with `express-validator` and conditional business rules.
- Progressive enhancement JS for dynamic author role selectors.
- Centralized error handling and 404 page.
- Transactional create/update for mangas (`BEGIN` / `COMMIT` / `ROLLBACK`).

## Tech Stack

- Runtime: Node.js (>=20)
- Framework: Express 5
- View Engine: EJS
- DB: PostgreSQL (`pg`)
- Validation: `express-validator`
- Dates: `date-fns`
- Tooling: ESLint, Prettier, Vitest (ready for tests)

## Architecture

Layered by concern:

| Layer         | Purpose                  | Location                                                             |
| ------------- | ------------------------ | -------------------------------------------------------------------- |
| Routes        | HTTP endpoints           | [`src/routes`](src/routes)                                           |
| Controllers   | Orchestrate model + view | [`src/controllers`](src/controllers)                                 |
| Models        | SQL + persistence        | [`src/models`](src/models)                                           |
| Views         | EJS templates            | [`src/views`](src/views)                                             |
| Public Assets | CSS / JS                 | [`src/public`](src/public)                                           |
| Validation    | Reusable validators      | [`src/middleware/validators.js`](src/middleware/validators.js)       |
| Utility       | Shared fetch logic       | [`src/utils/fetchSelectionData.js`](src/utils/fetchSelectionData.js) |

Entry point: [`src/app.js`](src/app.js)

Custom error: [`src/errors/NotFoundError.js`](src/errors/NotFoundError.js)

## Directory Snapshot

```
src/
  app.js
  config/pool.js
  controllers/
  routes/
  models/
  middleware/
  utils/
  views/
    partials/
  public/
    styles/
    js/
scripts/
  populateDb.js
```

## Database Schema

Created by [`scripts/populateDb.js`](scripts/populateDb.js):

Tables: `authors`, `status`, `demographics`, `roles`, `genres`, `magazines`, `mangas`, junctions: `mangas_authors`, `mangas_genres`.

Key relationships:

- `magazines.demographic_id -> demographics.id`
- `mangas.status_id -> status.id`
- `mangas.magazine_id -> magazines.id`
- `mangas_authors (manga_id, author_id, role_id)`
- `mangas_genres (manga_id, genre_id)`

## Setup

1. Clone:
   ```
   git clone https://github.com/LazyEllis/inventory-app.git
   cd inventory-app
   ```
2. Install deps:
   ```
   npm install
   ```
3. Create a PostgreSQL database (local or hosted).
4. Set environment variable `DATABASE_URL`.

### Environment

Create `.env`:

```
DATABASE_URL=postgres://user:password@host:port/dbname
PORT=3000
```

### Seed Schema

```
node scripts/populateDb.js $DATABASE_URL
```

(Use a fresh database; the script does plain `CREATE TABLE` statements.)

## Running

Development (with Node watch):

```
npm run dev
```

Production:

```
npm start
```

Visit: `http://localhost:3000`

## Routes (UI)

| Entity       | Base Path       |
| ------------ | --------------- |
| Home         | `/`             |
| Mangas       | `/mangas`       |
| Authors      | `/authors`      |
| Roles        | `/roles`        |
| Status       | `/status`       |
| Genres       | `/genres`       |
| Demographics | `/demographics` |
| Magazines    | `/magazines`    |

Common patterns:

- List: `GET /entity`
- New form: `GET /entity/new`
- Create: `POST /entity/new`
- Edit form: `GET /entity/:id/edit`
- Update: `POST /entity/:id/edit`
- Delete: `POST /entity/:id/delete`
- Manga profile: `GET /mangas/:id`

## Manga Filtering

Supported query keys (single at a time): `author`, `genre`, `demographic`, `magazine`, `status`.

Example:

```
/mangas?author=5
/mangas?status=2
```

Controller logic: [`getMangaList`](src/controllers/mangaController.js) builds a filter passed to [`findMangas`](src/models/mangaModel.js).

## Validation Highlights

Defined in [`validators.js`](src/middleware/validators.js):

- Required names (`title` for manga, `name` for others).
- Arrays for selected authors/genres.
- Referential integrity via numeric checks.
- Conditional business rule: ongoing vs completed fields (note: comparison uses fetched status row; ensure you compare `status.name` when extending).

## Transactions

Create & update manga operations wrap multi-table work in a transaction (`BEGIN` / `COMMIT` / `ROLLBACK`) inside [`createManga`](src/models/mangaModel.js) and [`updateManga`](src/models/mangaModel.js).

## Views & Assets

- Layout via partials: [`partials/header.ejs`](src/views/partials/header.ejs), [`partials/footer.ejs`](src/views/partials/footer.ejs).
- Form logic enhanced by [`form.js`](src/public/js/form.js) + utilities [`form-utils.js`](src/public/js/form-utils.js).
- CSS split by page type: list, form, profile, error, etc.

## Testing

Vitest configured in [`vitest.config.js`](vitest.config.js):

```
npm test
```

## Lint & Format

```
npm run lint
npm run format
```

## Future Ideas

- Add pagination & search.
- Add user authentication.
- Add API (JSON) layer.
- Improve status validation logic (compare `status.name`).
- Write unit tests for models and controllers.

## License

MIT. See [LICENSE](LICENSE)
