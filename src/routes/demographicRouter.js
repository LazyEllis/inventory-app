import { Router } from "express";
import {
  addDemographic,
  deleteDemographic,
  editDemographic,
  getDemographicList,
  renderAddDemographicForm,
  renderEditDemographicForm,
} from "../controllers/demographicController.js";
import { validateDemographic } from "../middleware/validators.js";

const demographicRouter = Router();

demographicRouter.get("/", getDemographicList);

demographicRouter.get("/new", renderAddDemographicForm);

demographicRouter.post("/new", validateDemographic, addDemographic);

demographicRouter.get("/:id/edit", renderEditDemographicForm);

demographicRouter.post("/:id/edit", validateDemographic, editDemographic);

demographicRouter.post("/:id/delete", deleteDemographic);

export default demographicRouter;
