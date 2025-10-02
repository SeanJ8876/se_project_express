const { get } = require("mongoose");
const { getUsers, createUser } = require("../controllers/users");
const router = require("express").Router();

router.get("/", getUsers);
router.get("/:userId", getUsers);
router.post("/", createUser);


module.exports = router;
