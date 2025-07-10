import pool from "../config/pool.js";

export const findDemographics = async () => {
  const { rows } = await pool.query("SELECT * FROM demographics ORDER BY name");

  return rows;
};

export const findDemographicById = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM demographics WHERE id = $1",
    [id],
  );

  return rows[0];
};

export const createDemographic = async ({ name }) => {
  await pool.query("INSERT INTO demographics (name) VALUES ($1)", [name]);
};

export const updateDemographic = async (id, { name }) => {
  await pool.query("UPDATE demographics SET name = $1 WHERE id = $2", [
    name,
    id,
  ]);
};

export const removeDemographic = async (id) => {
  await pool.query("DELETE FROM demographics WHERE id = $1", [id]);
};
