const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const { validateCardBody, validateId } = require("../middlewares/validation");

router.get("/", getItems);

router.post("/", auth, createItem, validateCardBody);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem, validateId);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
