import { format } from "date-fns";
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

// Turns a query parameter into an object with filter name and value
const getFilter = (query) =>
  Object.fromEntries(
    Object.entries(query)[0].map((value, index) =>
      index === 0 ? ["field", value] : ["value", value],
    ),
  );

export const getMangaList = async (req, res) => {
  const isQuery = Object.keys(req.query).length > 0;

  const mangas = await (isQuery
    ? findMangas(getFilter(req.query))
    : findMangas());

  res.render("list", { data: mangas, ROUTE_NAME });
};

export const getManga = async (req, res) => {
  const { id } = req.params;

  const manga = await findMangaById(id);

  if (!manga) {
    throw new NotFoundError("Manga Not Found");
  }

  res.render("profile", { data: manga, ROUTE_NAME, format });
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
