import pool from "../config/pool.js";

export const findAuthors = async () => {
  const { rows } = await pool.query("SELECT * FROM authors ORDER BY name");

  return rows;
};

export const findAuthorById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM authors WHERE id = $1", [
    id,
  ]);

  return rows[0];
};

export const createAuthor = async ({ name }) => {
  await pool.query("INSERT INTO authors (name) VALUES ($1)", [name]);
};

export const updateAuthor = async (id, { name }) => {
  await pool.query("UPDATE authors SET name = $1 WHERE id = $2", [name, id]);
};

export const removeAuthor = async (id) => {
  await pool.query("DELETE FROM authors WHERE id = $1", [id]);
};
