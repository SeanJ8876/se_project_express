const { get } = require("mongoose");
const { getUsers, createUser, getUserById } = require("../controllers/users");
const router = require("express").Router();

router.use((req, res, next) => {
  console.log("Request received for users Router");
  next();
});

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.post("/", createUser);

module.exports = router;
