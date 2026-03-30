const router = require("express").Router();
const { getCurrentUser, editUserProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserBody, validateAuth } = require("../middlewares/validation");
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, editUserProfile);

module.exports = router;
