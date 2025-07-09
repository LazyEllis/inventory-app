import {
  createAuthor,
  findAuthorById,
  findAuthors,
  removeAuthor,
  updateAuthor,
} from "../models/authorModel.js";
import NotFoundError from "../errors/NotFoundError.js";

const ROUTE_NAME = "Author";

export const getAuthorList = async (req, res) => {
  const authors = await findAuthors();
  res.render("list", { data: authors, ROUTE_NAME });
};

export const getAuthor = async (req, res) => {
  const { id } = req.params;

  const author = await findAuthorById(id);

  if (!author) {
    throw new NotFoundError("Author Not Found");
  }

  res.render("profile", { data: author, ROUTE_NAME });
};

export const renderAddAuthorForm = async (req, res) => {
  res.render("form", { ROUTE_NAME });
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

  res.render("form", { data: author, ROUTE_NAME });
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
