import {
  createAuthor,
  findAuthorById,
  findAuthors,
  removeAuthor,
  updateAuthor,
} from "../models/authorModel.js";
import NotFoundError from "../errors/NotFoundError.js";

export const getAuthorList = async (req, res) => {
  const authors = await findAuthors();
  res.render("author/index", { authors });
};

export const getAuthor = async (req, res) => {
  const { id } = req.params;

  const author = await findAuthorById(id);

  if (!author) {
    throw new NotFoundError("Author Not Found");
  }

  res.render("author/profile", { author });
};

export const renderAddAuthorForm = async (req, res) => {
  res.render("author/form");
};

export const addAuthor = async (req, res) => {
  const { name } = req.body;

  await createAuthor({ name });
  res.redirect("/authors");
};

export const renderEditAuthorForm = async (req, res) => {
  const { id } = req.params;

  const author = await findAuthorById(id);

  if (!author) {
    throw new NotFoundError("Author Not Found");
  }

  res.render("author/form", { author });
};

export const editAuthor = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await updateAuthor(id, { name });
  res.redirect("/authors");
};

export const deleteAuthor = async (req, res) => {
  const { id } = req.params;

  await removeAuthor(id);
  res.redirect("/authors");
};
