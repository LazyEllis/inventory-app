import { Router } from "express";
import {
  addAuthor,
  deleteAuthor,
  editAuthor,
  getAuthor,
  getAuthorList,
  renderAddAuthorForm,
  renderEditAuthorForm,
} from "../controllers/authorController.js";

const authorRouter = Router();

authorRouter.get("/", getAuthorList);

authorRouter.get("/new", renderAddAuthorForm);

authorRouter.post("/new", addAuthor);

authorRouter.get("/:id", getAuthor);

authorRouter.get("/:id/edit", renderEditAuthorForm);

authorRouter.post("/:id/edit", editAuthor);

authorRouter.post("/:id/delete", deleteAuthor);

export default authorRouter;
