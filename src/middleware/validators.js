import { body, validationResult } from "express-validator";
import { fetchSelectionData } from "../utils/fetchSelectionData.js";
import { findStatusById } from "../models/statusModel.js";

const nameValidator = (model) => {
  const field = model === "manga" ? "title" : "name";

  return body(field)
    .trim()
    .notEmpty()
    .withMessage(`You must enter the ${model}'s ${field}`);
};

const validate = (validators, route) => [
  ...validators,
  async (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);

    const selectionData = await fetchSelectionData(route);

    if (!errors.isEmpty()) {
      return res.status(400).render(`form`, {
        data: { ...req.body, id },
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

export const validateManga = validate(
  [
    nameValidator("manga"),
    body("authors", "You must select at least one author").isArray({ min: 1 }),
    body("authors.*.id", "All authors selected must be valid").toInt().isInt(),
    body("authors.*.role", "All author roles selected must be valid")
      .toInt()
      .isInt(),
    body("genres", "You must select at least one genre").isArray({ min: 1 }),
    body("genres.*.id", "All genres selected must be valid").toInt().isInt(),
    body("magazine", "You must select a valid magazine").toInt().isInt(),
    body("status")
      .toInt()
      .isInt()
      .withMessage("You must select a valid status")
      .bail()
      .custom(async (value, { req }) => {
        const status = await findStatusById(value);
        const fields = ["end_date", "volumes", "chapters"];

        const isOngoing = status === "Ongoing";
        const isSomeFieldEmpty = fields.some((field) => !req.body[field]);
        const isSomeFieldPresent = fields.some((field) => req.body[field]);

        if (isOngoing && isSomeFieldPresent) {
          throw new Error(
            "Ongoing mangas must leave their end date, number of volumes and number of chapters unspecified",
          );
        } else if (!isOngoing && isSomeFieldEmpty) {
          throw new Error(
            "Mangas must specify their end date, number of volumes and number of chapters if not currently ongoing",
          );
        }
      }),
    body("start_date", "The start date must be a valid date").isDate(),
    body("end_date")
      .default(undefined)
      .isDate()
      .withMessage("The end date must be a valid date")
      .custom((value, { req }) => value > req.body.start_date)
      .withMessage("The end date must be later than the start date")
      .optional(),
    body("volumes")
      .default(undefined)
      .toInt()
      .isInt({ min: 1 })
      .withMessage("The number of volumes must be greater than zero")
      .optional(),
    body("chapters")
      .default(undefined)
      .toInt()
      .isInt({ min: 1 })
      .withMessage("The number of chapters must be greater than zero")
      .custom((value, { req }) => value > req.body.volumes)
      .withMessage(
        "The number of chapters must be greater than the number of volumes",
      )
      .optional(),
  ],
  "Manga",
);
