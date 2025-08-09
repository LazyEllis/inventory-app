import { Router } from "express";
import {
  addStatus,
  deleteStatus,
  editStatus,
  getStatusList,
  renderAddStatusForm,
  renderEditStatusForm,
} from "../controllers/statusController.js";
import { validateStatus } from "../middleware/validators.js";

const statusRouter = Router();

statusRouter.get("/", getStatusList);

statusRouter.get("/new", renderAddStatusForm);

statusRouter.post("/new", validateStatus, addStatus);

statusRouter.get("/:id/edit", renderEditStatusForm);

statusRouter.post("/:id/edit", validateStatus, editStatus);

statusRouter.post("/:id/delete", deleteStatus);

export default statusRouter;
