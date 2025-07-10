import express from "express";
import path from "path";
import "dotenv/config";
import authorRouter from "./routes/authorRouter.js";
import statusRouter from "./routes/statusRoute.js";
import roleRouter from "./routes/roleRouter.js";

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/authors", authorRouter);
app.use("/status", statusRouter);
app.use("/roles", roleRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
