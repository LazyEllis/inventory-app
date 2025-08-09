import { Router } from "express";
import {
  addMagazine,
  deleteMagazine,
  editMagazine,
  getMagazineList,
  renderAddMagazineForm,
  renderEditMagazineForm,
} from "../controllers/magazineController.js";
import { validateMagazine } from "../middleware/validators.js";

const magazineRouter = Router();

magazineRouter.get("/", getMagazineList);

magazineRouter.get("/new", renderAddMagazineForm);

magazineRouter.post("/new", validateMagazine, addMagazine);

magazineRouter.get("/:id/edit", renderEditMagazineForm);

magazineRouter.post("/:id/edit", validateMagazine, editMagazine);

magazineRouter.post("/:id/delete", deleteMagazine);

export default magazineRouter;
