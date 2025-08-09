import { Router } from "express";
import {
  addAuthor,
  deleteAuthor,
  editAuthor,
  getAuthorList,
  renderAddAuthorForm,
  renderEditAuthorForm,
} from "../controllers/authorController.js";
import { validateAuthor } from "../middleware/validators.js";

const authorRouter = Router();

authorRouter.get("/", getAuthorList);

authorRouter.get("/new", renderAddAuthorForm);

authorRouter.post("/new", validateAuthor, addAuthor);

authorRouter.get("/:id/edit", renderEditAuthorForm);

authorRouter.post("/:id/edit", validateAuthor, editAuthor);

authorRouter.post("/:id/delete", deleteAuthor);

export default authorRouter;
