#! /usr/bin/env node

import { Client } from "pg";

const SQL = ``;

const main = async () => {
  console.log("Seeding...");
  const client = new Client({ connectionString: process.argv[2] });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done");
};

main();
