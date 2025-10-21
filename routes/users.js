const router = require("express").Router();
const { getUsers, createUser, getUserById } = require("../controllers/users");

router.use((req, res, next) => {
  console.log("Request received for users Router");
  next();
});

module.exports = router;
