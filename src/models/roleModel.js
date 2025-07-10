import pool from "../config/pool.js";

export const findRoles = async () => {
  const { rows } = await pool.query("SELECT * FROM roles ORDER BY name");

  return rows;
};

export const findRoleById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM roles WHERE id = $1", [id]);

  return rows[0];
};

export const createRole = async ({ name }) => {
  await pool.query("INSERT INTO roles (name) VALUES ($1)", [name]);
};

export const updateRole = async (id, { name }) => {
  await pool.query("UPDATE roles SET name = $1 WHERE id = $2", [name, id]);
};

export const removeRole = async (id) => {
  await pool.query("DELETE FROM roles WHERE id = $1", [id]);
};
