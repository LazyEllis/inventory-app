import pool from "../config/pool.js";

export const findGenres = async () => {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY name");

  return rows;
};

export const findGenreById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM genres WHERE id = $1", [id]);

  return rows[0];
};

export const createGenre = async ({ name }) => {
  await pool.query("INSERT INTO genres (name) VALUES ($1)", [name]);
};

export const updateGenre = async (id, { name }) => {
  await pool.query("UPDATE genres SET name = $1 WHERE id = $2", [name, id]);
};

export const removeGenre = async (id) => {
  await pool.query("DELETE FROM genres WHERE id = $1", [id]);
};
