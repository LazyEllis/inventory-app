import {
  createDemographic,
  findDemographicById,
  findDemographics,
  removeDemographic,
  updateDemographic,
} from "../models/demographicModel.js";
import NotFoundError from "../errors/NotFoundError.js";

const ROUTE_NAME = "Demographic";

export const getDemographicList = async (req, res) => {
  const demographics = await findDemographics();
  res.render("list", { data: demographics, ROUTE_NAME });
};

export const renderAddDemographicForm = async (req, res) => {
  res.render("form", { ROUTE_NAME });
};

export const addDemographic = async (req, res) => {
  const { name } = req.body;

  await createDemographic({ name });
  res.redirect("/demographics");
};

export const renderEditDemographicForm = async (req, res) => {
  const { id } = req.params;

  const demographic = await findDemographicById(id);

  if (!demographic) {
    throw new NotFoundError("Demographic Not Found");
  }

  res.render("form", { data: demographic, ROUTE_NAME });
};

export const editDemographic = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await updateDemographic(id, { name });
  res.redirect("/demographics");
};

export const deleteDemographic = async (req, res) => {
  const { id } = req.params;

  await removeDemographic(id);
  res.redirect("/demographics");
};
