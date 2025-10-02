const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const mainRouter = require("./routes/index");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

const routes = require("./routes");
app.use(routes);
app.use(express.json());

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
