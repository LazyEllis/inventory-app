import { body, validationResult } from "express-validator";
import { findDemographics } from "../models/demographicModel.js";

const nameValidator = (model) =>
  body("name")
    .trim()
    .notEmpty()
    .withMessage(`You must enter the ${model}'s name`);

const validate = (validators, routeName) => [
  ...validators,
  async (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);
    let demographics;

    if (id) {
      req.body.id = id;
    }

    if (routeName === "Magazine") {
      demographics = await findDemographics();
    }

    if (!errors.isEmpty()) {
      return res.status(400).render(`form`, {
        data: req.body,
        ROUTE_NAME: routeName,
        errors: errors.array(),
        demographics,
      });
    }

    next();
  },
];

const authorValidators = [nameValidator("author")];
const statusValidators = [nameValidator("status")];
const roleValidators = [nameValidator("role")];
const demographicValidators = [nameValidator("demographic")];
const genreValidators = [nameValidator("genre")];
const magazineValidators = [
  nameValidator("magazine"),
  body("demographic_id")
    .trim()
    .notEmpty()
    .withMessage("You must select your magazine's demographic")
    .isInt()
    .withMessage("You must select a valid demographic option"),
];

export const validateAuthor = validate(authorValidators, "Author");
export const validateStatus = validate(statusValidators, "Status");
export const validateRole = validate(roleValidators, "Role");
export const validateDemographic = validate(
  demographicValidators,
  "Demographic",
);
export const validateGenre = validate(genreValidators, "Demographic");
export const validateMagazine = validate(magazineValidators, "Magazine");
