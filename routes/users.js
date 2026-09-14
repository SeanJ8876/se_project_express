const router = require("express").Router();

const { getCurrentUser, editUserProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUpdateUser } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUpdateUser, editUserProfile);

module.exports = router;
