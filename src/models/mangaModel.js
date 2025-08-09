import pool from "../config/pool.js";

const FILTER_FIELDS = {
  author: "authors.id",
  genre: "genres.id",
  demographic: "demographics.id",
  magazine: "magazines.id",
  status: "status.id",
};

export const findMangas = async (filter = null) => {
  const filterClause = filter
    ? `WHERE ${FILTER_FIELDS[filter.field]} = $1`
    : "";

  const queryValues = filter ? [filter.value] : [];

  const query = `
    SELECT
      mangas.id,
      mangas.title,
      mangas.volumes,
      mangas.chapters,
      mangas.start_date,
      mangas.end_date,
      jsonb_agg(distinct jsonb_build_object('name', authors.name, 'role', roles.name)) AS authors, 
      status.name AS status,
      magazines.name AS magazine,
      demographics.name AS demographic,
      jsonb_agg(distinct jsonb_build_object('name', genres.name)) AS genres 
    FROM mangas
    JOIN status
      ON mangas.status_id = status.id
    JOIN magazines
      ON mangas.magazine_id = magazines.id
    JOIN demographics
      ON magazines.demographic_id = demographics.id
    JOIN mangas_authors
      ON mangas.id = mangas_authors.manga_id
    JOIN authors
      ON mangas_authors.author_id = authors.id
    JOIN roles
      ON mangas_authors.role_id = roles.id
    JOIN mangas_genres
      ON mangas.id = mangas_genres.manga_id
    JOIN genres
      ON mangas_genres.genre_id = genres.id
    ${filterClause}
    GROUP BY mangas.id, status.id, magazines.id, demographics.id
    ORDER BY mangas.title;
  `;

  const { rows } = await pool.query(query, queryValues);

  return rows;
};

export const findMangaById = async (id, isForm = false) => {
  const formQuery = `
    SELECT
      mangas.id,
      mangas.title,
      mangas.volumes,
      mangas.chapters,
      mangas.start_date,
      mangas.end_date,
      jsonb_agg(distinct jsonb_build_object('id', mangas_authors.author_id, 'role', mangas_authors.role_id)) AS authors,
      mangas.status_id AS status,
      mangas.magazine_id AS magazine,
      jsonb_agg(distinct jsonb_build_object('id', mangas_genres.genre_id)) AS genres
    FROM mangas
    JOIN mangas_authors
      ON mangas.id = mangas_authors.manga_id
    JOIN mangas_genres
      ON mangas.id = mangas_genres.manga_id
    WHERE mangas.id = $1
    GROUP BY mangas.id
  `;

  const fullQuery = `
    SELECT
      mangas.id,
      mangas.title,
      mangas.volumes,
      mangas.chapters,
      mangas.start_date,
      mangas.end_date,
      jsonb_agg(distinct jsonb_build_object('name', authors.name, 'role', roles.name)) AS authors, 
      status.name AS status,
      magazines.name AS magazine,
      demographics.name AS demographic,
      jsonb_agg(distinct jsonb_build_object('name', genres.name)) AS genres 
    FROM mangas
    JOIN status
      ON mangas.status_id = status.id
    JOIN magazines
      ON mangas.magazine_id = magazines.id
    JOIN demographics
      ON magazines.demographic_id = demographics.id
    JOIN mangas_authors
      ON mangas.id = mangas_authors.manga_id
    JOIN authors
      ON mangas_authors.author_id = authors.id
    JOIN roles
      ON mangas_authors.role_id = roles.id
    JOIN mangas_genres
      ON mangas.id = mangas_genres.manga_id
    JOIN genres
      ON mangas_genres.genre_id = genres.id
    WHERE mangas.id = $1
    GROUP BY mangas.id, status.id, magazines.id, demographics.id
  `;

  const query = isForm ? formQuery : fullQuery;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
};

export const createManga = async ({
  title,
  authors,
  genres,
  magazine,
  status,
  start_date,
  end_date,
  volumes,
  chapters,
}) => {
  try {
    await pool.query("BEGIN");

    const result = await pool.query(
      "INSERT INTO mangas (title, magazine_id, status_id, start_date, end_date, volumes, chapters) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [title, magazine, status, start_date, end_date, volumes, chapters],
    );

    const mangaId = result.rows[0].id;

    const authorQuery =
      "INSERT INTO mangas_authors (manga_id, author_id, role_id) VALUES ($1, $2, $3)";

    for (const author of authors) {
      await pool.query(authorQuery, [mangaId, author.id, author.role]);
    }

    const genreQuery =
      "INSERT INTO mangas_genres (manga_id, genre_id) VALUES ($1, $2)";

    for (const genre of genres) {
      await pool.query(genreQuery, [mangaId, genre.id]);
    }

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

export const updateManga = async (
  id,
  {
    title,
    authors,
    genres,
    magazine,
    status,
    start_date,
    end_date,
    volumes,
    chapters,
  },
) => {
  try {
    await pool.query("BEGIN");

    await pool.query(
      "UPDATE mangas SET title = $1, magazine_id = $2, status_id = $3, start_date = $4, end_date = $5, volumes = $6, chapters = $7 WHERE id = $8",
      [title, magazine, status, start_date, end_date, volumes, chapters, id],
    );

    const authorIds = authors.map((author) => author.id);

    const genreIds = genres.map((genre) => genre.id);

    await pool.query(
      "DELETE FROM mangas_authors WHERE manga_id = $1 AND author_id != ANY($2::int[])",
      [id, authorIds],
    );

    await pool.query(
      "DELETE FROM mangas_genres WHERE manga_id = $1 AND genre_id != ANY($2::int[])",
      [id, genreIds],
    );

    const authorQuery = `
      INSERT INTO mangas_authors (manga_id, author_id, role_id) 
      VALUES ($1, $2, $3)
      ON CONFLICT (manga_id, author_id)
      DO UPDATE SET
        manga_id = EXCLUDED.manga_id,
        author_id = EXCLUDED.author_id,
        role_id = EXCLUDED.role_id
    `;

    for (const author of authors) {
      await pool.query(authorQuery, [id, author.id, author.role]);
    }

    const genreQuery = `
      INSERT INTO mangas_genres (manga_id, genre_id) 
      VALUES ($1, $2)
      ON CONFLICT (manga_id, genre_id)
      DO UPDATE SET
        manga_id = EXCLUDED.manga_id,
        genre_id = EXCLUDED.genre_id
    `;

    for (const genre of genres) {
      await pool.query(genreQuery, [id, genre.id]);
    }

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

export const removeManga = async (id) => {
  await pool.query("DELETE FROM mangas WHERE id = $1", [id]);
};
