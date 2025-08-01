#! /usr/bin/env node

import { Client } from "pg";

const SQL = `
CREATE TABLE authors (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

CREATE TABLE status (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE demographics (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE roles (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE genres (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE magazines (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  demographic_id INT NOT NULL REFERENCES demographics
);

CREATE TABLE mangas (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  volumes INT CHECK (volumes > 0),
  chapters INT CHECK (chapters > 0),
  status_id INT NOT NULL REFERENCES status,
  start_date DATE NOT NULL,
  end_date DATE CHECK (end_date > start_date),
  magazine_id INT NOT NULL REFERENCES magazines
);

CREATE TABLE mangas_authors (
  manga_id INT NOT NULL REFERENCES mangas ON DELETE CASCADE,
  author_id INT NOT NULL REFERENCES authors,
  role_id INT NOT NULL REFERENCES roles,
  PRIMARY KEY (manga_id, author_id)
);

CREATE TABLE mangas_genres (
  manga_id INT NOT NULL REFERENCES mangas ON DELETE CASCADE,
  genre_id INT NOT NULL REFERENCES genres,
  PRIMARY KEY (manga_id, genre_id)
)
`;

const main = async () => {
  console.log("Seeding...");
  const client = new Client({ connectionString: process.argv[2] });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done");
};

main();
