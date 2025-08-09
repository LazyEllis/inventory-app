import { Router } from "express";
import {
  addGenre,
  deleteGenre,
  editGenre,
  getGenreList,
  renderAddGenreForm,
  renderEditGenreForm,
} from "../controllers/genreController.js";
import { validateGenre } from "../middleware/validators.js";

const genreRouter = Router();

genreRouter.get("/", getGenreList);

genreRouter.get("/new", renderAddGenreForm);

genreRouter.post("/new", validateGenre, addGenre);

genreRouter.get("/:id/edit", renderEditGenreForm);

genreRouter.post("/:id/edit", validateGenre, editGenre);

genreRouter.post("/:id/delete", deleteGenre);

export default genreRouter;
