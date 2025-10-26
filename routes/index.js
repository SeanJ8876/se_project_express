const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const clothingItems = require("./clothingItems");
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const { createUser } = require("../controllers/users");

router.use("/items",clothingItems);
router.use("/users", userRouter);

router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
