const express = require("express");
const mongoose = require("mongoose");
const { login } = require("./controllers/users");
const { createUser } = require("./controllers/users");

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

app.post("/signin", login);
app.post("/signup", createUser);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
