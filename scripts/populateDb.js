#! /usr/bin/env node

import { Client } from "pg";

const SQL = `
BEGIN;

-- Schema ---------------------------------------------------------------------
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
);

-- Seed Lookup Data -----------------------------------------------------------
INSERT INTO status (name) VALUES
  ('Ongoing'),
  ('Complete'),
  ('Hiatus'),
  ('Cancelled');

INSERT INTO demographics (name) VALUES
  ('Shounen'),
  ('Seinen'),
  ('Shoujo'),
  ('Josei');

INSERT INTO roles (name) VALUES
  ('Story & Art'),
  ('Story'),
  ('Art');

INSERT INTO genres (name) VALUES
  ('Action'),
  ('Adventure'),
  ('Fantasy'),
  ('Dark Fantasy'),
  ('Historical'),
  ('Martial Arts');

-- Seed Magazines (linked to demographics) ------------------------------------
INSERT INTO magazines (name, demographic_id)
VALUES
  ('Weekly Shonen Jump', (SELECT id FROM demographics WHERE name='Shounen')),
  ('Young Animal',       (SELECT id FROM demographics WHERE name='Seinen')),
  ('Weekly Morning',     (SELECT id FROM demographics WHERE name='Seinen')),
  ('Monthly Afternoon',  (SELECT id FROM demographics WHERE name='Seinen'));

-- Seed Authors ----------------------------------------------------------------
INSERT INTO authors (name) VALUES
  ('Masashi Kishimoto'),
  ('Eiichiro Oda'),
  ('Tite Kubo'),
  ('Kentaro Miura'),
  ('Takehiko Inoue'),
  ('Makoto Yukimura');

-- Seed Mangas -----------------------------------------------------------------
-- For Ongoing / Hiatus series leave end_date, volumes, chapters NULL
INSERT INTO mangas (title, volumes, chapters, status_id, start_date, end_date, magazine_id) VALUES
  ('Naruto',        72, 700, (SELECT id FROM status WHERE name='Complete'), '1999-09-21', '2014-11-10', (SELECT id FROM magazines WHERE name='Weekly Shonen Jump')),
  ('One Piece',     NULL, NULL, (SELECT id FROM status WHERE name='Ongoing'), '1997-07-22', NULL, (SELECT id FROM magazines WHERE name='Weekly Shonen Jump')),
  ('Bleach',        74, 686, (SELECT id FROM status WHERE name='Complete'), '2001-08-07', '2016-08-22', (SELECT id FROM magazines WHERE name='Weekly Shonen Jump')),
  ('Berserk',       NULL, NULL, (SELECT id FROM status WHERE name='Ongoing'), '1989-08-25', NULL, (SELECT id FROM magazines WHERE name='Young Animal')),
  ('Vagabond',      NULL, NULL, (SELECT id FROM status WHERE name='Hiatus'),  '1998-09-17', NULL, (SELECT id FROM magazines WHERE name='Weekly Morning')),
  ('Vinland Saga',  NULL, NULL, (SELECT id FROM status WHERE name='Ongoing'), '2005-04-13', NULL, (SELECT id FROM magazines WHERE name='Monthly Afternoon'));

-- Link Mangas to Authors (single role = Story & Art) -------------------------------
INSERT INTO mangas_authors (manga_id, author_id, role_id)
SELECT m.id, a.id, (SELECT id FROM roles WHERE name='Story & Art')
FROM mangas m
JOIN authors a ON
  (m.title='Naruto'       AND a.name='Masashi Kishimoto') OR
  (m.title='One Piece'    AND a.name='Eiichiro Oda') OR
  (m.title='Bleach'       AND a.name='Tite Kubo') OR
  (m.title='Berserk'      AND a.name='Kentaro Miura') OR
  (m.title='Vagabond'     AND a.name='Takehiko Inoue') OR
  (m.title='Vinland Saga' AND a.name='Makoto Yukimura');

-- Link Mangas to Genres -------------------------------------------------------
-- Helper CTE to simplify inserts
WITH mg AS (
  SELECT id, title FROM mangas
)
INSERT INTO mangas_genres (manga_id, genre_id)
SELECT mg.id, g.id
FROM mg
JOIN genres g ON
  (mg.title='Naruto'       AND g.name IN ('Action','Adventure','Fantasy')) OR
  (mg.title='One Piece'    AND g.name IN ('Action','Adventure','Fantasy')) OR
  (mg.title='Bleach'       AND g.name IN ('Action','Fantasy')) OR
  (mg.title='Berserk'      AND g.name IN ('Action','Dark Fantasy')) OR
  (mg.title='Vagabond'     AND g.name IN ('Historical','Martial Arts')) OR
  (mg.title='Vinland Saga' AND g.name IN ('Historical','Action'));

COMMIT;
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
