const ClothingItems = require("../models/clothingItems");
const { NOT_FOUND, BAD_REQUEST, DEFAULT } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItems.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided when creating an item." });
      } else {
        res.status(DEFAULT).send({ message: err.message });
      }
    });
};

const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => res.status(DEFAULT).send({ message: "Error from getItems" }));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(">>>>>>>>", itemId);
  ClothingItems.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Card ID Not Found");
      error.name = "NotFound";
      throw error;
    })
    .then((item) =>
      ClothingItems.deleteOne(item).then(() =>
        res.status(200).send({ message: "Item deleted successfully" })
      )
    )
    .catch((err) => {
      if (err.name === "NotFound") {
        return res.status(NOT_FOUND).send({ message: "Server Error" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res.status(DEFAULT).send({ message: "Server Error" });
    });
};

const likeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Error liking item", error: err.message });
    });
};

const dislikeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Error unliking item", error: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
