import { findDemographics } from "../models/demographicModel.js";
import { findGenres } from "../models/genreModel.js";
import { findMagazines } from "../models/magazineModel.js";
import { findStatus } from "../models/statusModel.js";
import { findAuthors } from "../models/authorModel.js";
import { findRoles } from "../models/roleModel.js";

export const fetchSelectionData = async (route) => {
  let demographics, authors, roles, genres, magazines, status;

  if (route === "Magazine") {
    demographics = await findDemographics();
  } else if (route === "Manga") {
    [authors, roles, genres, magazines, status] = await Promise.all([
      findAuthors(),
      findRoles(),
      findGenres(),
      findMagazines(),
      findStatus(),
    ]);
  }

  return { demographics, authors, roles, genres, magazines, status };
};
