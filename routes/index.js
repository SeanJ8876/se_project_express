const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const { validateUserBody, validateAuth } = require("../middlewares/validation");

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateAuth, login);

router.use("/items", clothingItems);
router.use("/users", userRouter);

module.exports = router;
