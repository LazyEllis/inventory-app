import pool from "../config/pool.js";

export const findMangas = async () => {
  const query = `
    SELECT 
      mangas.id,
      mangas.title, 
      mangas.volumes, 
      mangas.chapters, 
      mangas.start_date, 
      mangas.end_date, 
      authors.name AS author, 
      roles.name AS role, 
      status.name AS status, 
      magazines.name AS magazine, 
      demographics.name AS demographic, 
      genres.name AS genre
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
    ORDER BY mangas.title
  `;

  const { rows } = await pool.query(query);

  return rows;
};

export const findMangaById = async (id) => {
  const query = `
    SELECT 
      mangas.id,
      mangas.title, 
      mangas.volumes, 
      mangas.chapters, 
      mangas.start_date, 
      mangas.end_date, 
      authors.name AS author, 
      roles.name AS role, 
      status.name AS status, 
      magazines.name AS magazine, 
      demographics.name AS demographic, 
      genres.name AS genre
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
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
};

export const removeManga = async (id) => {
  await pool.query("DELETE FROM mangas WHERE id = $1", [id]);
};
