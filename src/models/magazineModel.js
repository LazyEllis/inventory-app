import pool from "../config/pool.js";

export const findMagazines = async () => {
  const query = `
    SELECT 
      magazines.id, 
      magazines.name, 
      demographics.name AS demographic
    FROM magazines 
    JOIN demographics
      ON magazines.demographic_id = demographics.id 
    ORDER BY magazines.name
  `;

  const { rows } = await pool.query(query);

  return rows;
};

export const findMagazineById = async (id) => {
  const query = `
    SELECT 
      magazines.id, 
      magazines.name, 
      magazines.demographic_id, 
      demographics.name AS demographic
    FROM magazines 
    JOIN demographics
      ON magazines.demographic_id = demographics.id 
    WHERE magazines.id = $1
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
};

export const createMagazine = async ({ name, demographic_id }) => {
  await pool.query(
    "INSERT INTO magazines (name, demographic_id) VALUES ($1, $2)",
    [name, demographic_id],
  );
};

export const updateMagazine = async (id, { name, demographic_id }) => {
  await pool.query(
    "UPDATE magazines SET name = $1, demographic_id = $2 WHERE id = $3",
    [name, demographic_id, id],
  );
};

export const removeMagazine = async (id) => {
  await pool.query("DELETE FROM magazines WHERE id = $1", [id]);
};
