const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { NOT_FOUND } = require("./utils/errors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

const { PORT = 3001 } = process.env;
const mainRouter = require("./routes/index");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch();

app.use(express.json());

app.use(cors());

app.use("/", mainRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

app.listen(PORT, () => {});

app.use(errorHandler);

app.use(routes);

app.use(errors());

app.use(errorHandler);

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
