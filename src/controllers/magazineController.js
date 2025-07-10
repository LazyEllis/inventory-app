import {
  createMagazine,
  findMagazineById,
  findMagazines,
  removeMagazine,
  updateMagazine,
} from "../models/magazineModel.js";
import { findDemographics } from "../models/demographicModel.js";
import NotFoundError from "../errors/NotFoundError.js";

const ROUTE_NAME = "Magazine";

export const getMagazineList = async (req, res) => {
  const magazines = await findMagazines();
  res.render("list", { data: magazines, ROUTE_NAME });
};

export const getMagazine = async (req, res) => {
  const { id } = req.params;

  const magazine = await findMagazineById(id);

  if (!magazine) {
    throw new NotFoundError("Magazine Not Found");
  }

  res.render("profile", { data: magazine, ROUTE_NAME });
};

export const renderAddMagazineForm = async (req, res) => {
  const demographics = await findDemographics();

  res.render("form", { ROUTE_NAME, demographics });
};

export const addMagazine = async (req, res) => {
  const { name, demographic_id } = req.body;

  await createMagazine({ name, demographic_id });
  res.redirect("/magazines");
};

export const renderEditMagazineForm = async (req, res) => {
  const { id } = req.params;

  const magazine = await findMagazineById(id);
  const demographics = await findDemographics();

  if (!magazine) {
    throw new NotFoundError("Magazine Not Found");
  }

  res.render("form", { data: magazine, ROUTE_NAME, demographics });
};

export const editMagazine = async (req, res) => {
  const { id } = req.params;
  const { name, demographic_id } = req.body;

  await updateMagazine(id, { name, demographic_id });
  res.redirect("/magazines");
};

export const deleteMagazine = async (req, res) => {
  const { id } = req.params;

  await removeMagazine(id);
  res.redirect("/magazines");
};
