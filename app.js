const express = require("express");
const mongoose = require("mongoose");
const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3001 } = process.env;
const mainRouter = require("./routes/index");

const app = express();
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use(cors());

app.use("/", mainRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
