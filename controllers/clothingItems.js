const mongoose = require("mongoose");

const ClothingItems = require("../models/clothingItems");
const {
  NOT_FOUND,
  BAD_REQUEST,
  DEFAULT,
  FORBIDDEN,
  BadRequestError,
} = require("../utils/errors");

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
        res
          .status(DEFAULT)
          .send({ message: "An error occurred on the server" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => res.status(DEFAULT).send({ message: "Error from getItems" }));
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }

    const item = await ClothingItems.findById(itemId);

    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    if (!item.owner.equals(req.user._id)) {
      return res.status(FORBIDDEN).json({ message: "Access denied" });
    }

    await ClothingItems.findByIdAndDelete(itemId);

    return res.json({ message: "Item deleted successfully" });
  } catch (err) {
    return res
      .status(DEFAULT)
      .json({ message: "An error occurred on the server" });
  }
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
        .send({ message: "An error occurred on the server" });
    });
};

const dislikeItem = (req, res, next) => {
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
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
