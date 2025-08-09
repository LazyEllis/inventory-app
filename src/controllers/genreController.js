import {
  createGenre,
  findGenreById,
  findGenres,
  removeGenre,
  updateGenre,
} from "../models/genreModel.js";
import NotFoundError from "../errors/NotFoundError.js";

const ROUTE_NAME = "Genre";

export const getGenreList = async (req, res) => {
  const genres = await findGenres();
  res.render("list", { data: genres, ROUTE_NAME });
};

export const renderAddGenreForm = async (req, res) => {
  res.render("form", { ROUTE_NAME });
};

export const addGenre = async (req, res) => {
  const { name } = req.body;

  await createGenre({ name });
  res.redirect("/genres");
};

export const renderEditGenreForm = async (req, res) => {
  const { id } = req.params;

  const genre = await findGenreById(id);

  if (!genre) {
    throw new NotFoundError("Genre Not Found");
  }

  res.render("form", { data: genre, ROUTE_NAME });
};

export const editGenre = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await updateGenre(id, { name });
  res.redirect("/genres");
};

export const deleteGenre = async (req, res) => {
  const { id } = req.params;

  await removeGenre(id);
  res.redirect("/genres");
};
