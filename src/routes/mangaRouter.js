import { Router } from "express";
import {
  deleteManga,
  getManga,
  getMangaList,
  renderAddMangaForm,
  renderEditMangaForm,
} from "../controllers/mangaController.js";

const mangaRouter = Router();

mangaRouter.get("/", getMangaList);

mangaRouter.get("/new", renderAddMangaForm);

mangaRouter.get("/:id", getManga);

mangaRouter.get("/:id/edit", renderEditMangaForm);

mangaRouter.post("/:id/delete", deleteManga);

export default mangaRouter;
