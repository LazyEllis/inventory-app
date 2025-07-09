import {
  createStatus,
  findStatusById,
  findStatus,
  removeStatus,
  updateStatus,
} from "../models/statusModel.js";
import NotFoundError from "../errors/NotFoundError.js";

export const getStatusList = async (req, res) => {
  const status = await findStatus();
  res.render("status/index", { status });
};

export const getStatus = async (req, res) => {
  const { id } = req.params;

  const status = await findStatusById(id);

  if (!status) {
    throw new NotFoundError("Status Not Found");
  }

  res.render("status/profile", { status });
};

export const renderAddStatusForm = async (req, res) => {
  res.render("status/form");
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

  res.render("status/form", { status });
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
