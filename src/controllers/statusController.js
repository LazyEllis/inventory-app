import {
  createStatus,
  findStatusById,
  findStatus,
  removeStatus,
  updateStatus,
} from "../models/statusModel.js";
import NotFoundError from "../errors/NotFoundError.js";

const ROUTE_NAME = "Status";

export const getStatusList = async (req, res) => {
  const status = await findStatus();
  res.render("list", { data: status, ROUTE_NAME });
};

export const getStatus = async (req, res) => {
  const { id } = req.params;

  const status = await findStatusById(id);

  if (!status) {
    throw new NotFoundError("Status Not Found");
  }

  res.render("profile", { data: status, ROUTE_NAME });
};

export const renderAddStatusForm = async (req, res) => {
  res.render("form", { ROUTE_NAME });
};

export const addStatus = async (req, res) => {
  const { name } = req.body;

  await createStatus({ name });
  res.redirect("/status");
};

export const renderEditStatusForm = async (req, res) => {
  const { id } = req.params;

  const status = await findStatusById(id);

  if (!status) {
    throw new NotFoundError("Status Not Found");
  }

  res.render("form", { data: status, ROUTE_NAME });
};

export const editStatus = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await updateStatus(id, { name });
  res.redirect("/status");
};

export const deleteStatus = async (req, res) => {
  const { id } = req.params;

  await removeStatus(id);
  res.redirect("/status");
};
