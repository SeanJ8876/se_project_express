const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItems);
router.use("/users", userRouter);

module.exports = router;
