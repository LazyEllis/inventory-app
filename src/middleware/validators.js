import { body, validationResult } from "express-validator";
import { fetchSelectionData } from "../utils/fetchSelectionData.js";

const nameValidator = (model) =>
  body("name")
    .trim()
    .notEmpty()
    .withMessage(`You must enter the ${model}'s name`);

const validate = (validators, route) => [
  ...validators,
  async (req, res, next) => {
    const errors = validationResult(req);
    req.body.id = req.params.id;

    const selectionData = await fetchSelectionData(route);

    if (!errors.isEmpty()) {
      return res.status(400).render(`form`, {
        data: req.body,
        ROUTE_NAME: route,
        ...selectionData,
        errors: errors.array(),
      });
    }

    next();
  },
];

export const validateAuthor = validate([nameValidator("author")], "Author");

export const validateStatus = validate([nameValidator("status")], "Status");

export const validateRole = validate([nameValidator("role")], "Role");

export const validateDemographic = validate(
  [nameValidator("demographic")],
  "Demographic",
);

export const validateGenre = validate([nameValidator("genre")], "Genre");

export const validateMagazine = validate(
  [
    nameValidator("magazine"),
    body("demographic_id", "You must select a valid demographic")
      .toInt()
      .isInt(),
  ],
  "Magazine",
);
