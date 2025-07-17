import { Router } from "express";
import {
  addManga,
  deleteManga,
  editManga,
  getManga,
  getMangaList,
  renderAddMangaForm,
  renderEditMangaForm,
} from "../controllers/mangaController.js";
import { validateManga } from "../middleware/validators.js";

const mangaRouter = Router();

mangaRouter.get("/", getMangaList);

mangaRouter.get("/new", renderAddMangaForm);

mangaRouter.post("/new", validateManga, addManga);

mangaRouter.get("/:id", getManga);

mangaRouter.get("/:id/edit", renderEditMangaForm);

mangaRouter.post("/:id/edit", validateManga, editManga);

mangaRouter.post("/:id/delete", deleteManga);

export default mangaRouter;
