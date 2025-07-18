import {
  createManga,
  findMangaById,
  findMangas,
  removeManga,
  updateManga,
} from "../models/mangaModel.js";
import { fetchSelectionData } from "../utils/fetchSelectionData.js";
import NotFoundError from "../errors/NotFoundError.js";

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
  const selectionData = await fetchSelectionData(ROUTE_NAME);

  res.render("form", { ROUTE_NAME, ...selectionData });
};

export const addManga = async (req, res) => {
  await createManga(req.body);
  res.redirect("/mangas");
};

export const renderEditMangaForm = async (req, res) => {
  const { id } = req.params;

  const manga = await findMangaById(id, true);

  if (!manga) {
    throw new NotFoundError("Manga Not Found");
  }

  const selectionData = await fetchSelectionData(ROUTE_NAME);

  res.render("form", { data: manga, ROUTE_NAME, ...selectionData });
};

export const editManga = async (req, res) => {
  const { id } = req.params;

  await updateManga(id, req.body);
  res.redirect("/mangas");
};

export const deleteManga = async (req, res) => {
  const { id } = req.params;

  await removeManga(id);
  res.redirect("/mangas");
};
