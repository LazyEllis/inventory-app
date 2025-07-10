import { body, validationResult } from "express-validator";

const nameValidator = (model) =>
  body("name")
    .trim()
    .notEmpty()
    .withMessage(`You must enter the ${model}'s name`);

const validate = (validators, routeName) => [
  ...validators,
  (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);

    if (id) {
      req.body.id = id;
    }

    if (!errors.isEmpty()) {
      return res.status(400).render(`form`, {
        data: req.body,
        ROUTE_NAME: routeName,
        errors: errors.array(),
      });
    }

    next();
  },
];

const authorValidators = [nameValidator("author")];
const statusValidators = [nameValidator("status")];
const roleValidators = [nameValidator("role")];

export const validateAuthor = validate(authorValidators, "Author");
export const validateStatus = validate(statusValidators, "Status");
export const validateRole = validate(roleValidators, "Role");
