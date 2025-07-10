import { Router } from "express";
import {
  addRole,
  deleteRole,
  editRole,
  getRole,
  getRoleList,
  renderAddRoleForm,
  renderEditRoleForm,
} from "../controllers/roleController.js";
import { validateRole } from "../middleware/validators.js";

const roleRouter = Router();

roleRouter.get("/", getRoleList);

roleRouter.get("/new", renderAddRoleForm);

roleRouter.post("/new", validateRole, addRole);

roleRouter.get("/:id", getRole);

roleRouter.get("/:id/edit", renderEditRoleForm);

roleRouter.post("/:id/edit", validateRole, editRole);

roleRouter.post("/:id/delete", deleteRole);

export default roleRouter;
