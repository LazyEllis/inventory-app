import { Router } from "express";
import {
  renderHomePage,
  render404Page,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", renderHomePage);

indexRouter.get("/*splat", render404Page);

export default indexRouter;
