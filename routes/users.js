const router = require("express").Router();
const { getCurrentUser, editUserProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, editUserProfile);
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateAuth, login);

const { errors } = require("celebrate");
app.use(errors()); // Add this after your routes

module.exports = router;
