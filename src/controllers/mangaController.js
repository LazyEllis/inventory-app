import {
  findMangaById,
  findMangas,
  removeManga,
} from "../models/mangaModel.js";
import NotFoundError from "../errors/NotFoundError.js";
import { findGenres } from "../models/genreModel.js";
import { findMagazines } from "../models/magazineModel.js";
import { findStatus } from "../models/statusModel.js";
import { findAuthors } from "../models/authorModel.js";
import { findRoles } from "../models/roleModel.js";

const ROUTE_NAME = "Manga";

export const getMangaList = async (req, res) => {
  const mangas = await findMangas();
  res.render("list", { data: mangas, ROUTE_NAME });
};

export const getManga = async (req, res) => {
  const { id } = req.params;

  const manga = await findMangaById(id);

  if (!manga) {
    throw new NotFoundError("Manga Not Found");
  }

  res.render("profile", { data: manga, ROUTE_NAME });
};

export const renderAddMangaForm = async (req, res) => {
  const [authors, roles, genres, magazines, status] = await Promise.all([
    findAuthors(),
    findRoles(),
    findGenres(),
    findMagazines(),
    findStatus(),
  ]);

  res.render("form", { ROUTE_NAME, authors, roles, genres, magazines, status });
};

export const renderEditMangaForm = async (req, res) => {
  const { id } = req.params;

  const manga = await findMangaById(id);

  if (!manga) {
    throw new NotFoundError("Manga Not Found");
  }

  const [authors, roles, genres, magazines, status] = await Promise.all([
    findAuthors(),
    findRoles(),
    findGenres(),
    findMagazines(),
    findStatus(),
  ]);

  res.render("form", {
    data: manga,
    ROUTE_NAME,
    authors,
    roles,
    genres,
    magazines,
    status,
  });
};

export const deleteManga = async (req, res) => {
  const { id } = req.params;

  await removeManga(id);
  res.redirect("/mangas");
};
