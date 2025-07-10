import {
  createRole,
  findRoleById,
  findRoles,
  removeRole,
  updateRole,
} from "../models/roleModel.js";
import NotFoundError from "../errors/NotFoundError.js";

const ROUTE_NAME = "Role";

export const getRoleList = async (req, res) => {
  const roles = await findRoles();
  res.render("list", { data: roles, ROUTE_NAME });
};

export const getRole = async (req, res) => {
  const { id } = req.params;

  const role = await findRoleById(id);

  if (!role) {
    throw new NotFoundError("Role Not Found");
  }

  res.render("profile", { data: role, ROUTE_NAME });
};

export const renderAddRoleForm = async (req, res) => {
  res.render("form", { ROUTE_NAME });
};

export const addRole = async (req, res) => {
  const { name } = req.body;

  await createRole({ name });
  res.redirect("/roles");
};

export const renderEditRoleForm = async (req, res) => {
  const { id } = req.params;

  const role = await findRoleById(id);

  if (!role) {
    throw new NotFoundError("Role Not Found");
  }

  res.render("form", { data: role, ROUTE_NAME });
};

export const editRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await updateRole(id, { name });
  res.redirect("/roles");
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;

  await removeRole(id);
  res.redirect("/roles");
};
