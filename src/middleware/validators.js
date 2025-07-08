import { body, validationResult } from "express-validator";

const validate = (validators, model) => [
  ...validators,
  (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);

    if (id) {
      req.body.id = id;
    }

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render(`${model}/form`, { [model]: req.body, errors: errors.array() });
    }

    next();
  },
];

const authorValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("You must enter the author's name"),
];

export const validateAuthor = validate(authorValidators, "author");
