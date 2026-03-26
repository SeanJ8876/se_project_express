const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.post("/", auth, createItem, validateCardBody);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem, validateId);
router.delete("/:itemId/likes", auth, dislikeItem);

const { errors } = require("celebrate");
app.use(errors()); // Add this after your routes

module.exports = router;
