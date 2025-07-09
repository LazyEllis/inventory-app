import pool from "../config/pool.js";

export const findStatus = async () => {
  const { rows } = await pool.query("SELECT * FROM status ORDER BY name");

  return rows;
};

export const findStatusById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM status WHERE id = $1", [id]);

  return rows[0];
};

export const createStatus = async ({ name }) => {
  await pool.query("INSERT INTO status (name) VALUES ($1)", [name]);
};

export const updateStatus = async (id, { name }) => {
  await pool.query("UPDATE status SET name = $1 WHERE id = $2", [name, id]);
};

export const removeStatus = async (id) => {
  await pool.query("DELETE FROM status WHERE id = $1", [id]);
};
