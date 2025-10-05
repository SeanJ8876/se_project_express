const ClothingItems = require("../models/clothingItems");

const createItem = (req, res) => {
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;
  ClothingItems.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Invalid data provided when creating an item." });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => res.status(500).send({ message: "Error from getItems" }));
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { name, weather, imageUrl } = req.body;

  ClothingItems.findByIdAndUpdate(
    itemId,
    { name, weather, imageUrl },
    { new: true, runValidators: true }
  )
    .orFail(() => new Error("NotFound"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "NotFound") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(400).send({ message: "Error from updateItem." });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
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
      console.log(err);
      if (err.name === "NotFound") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      res
        .status(500)
        .send({ message: "Error liking item", error: err.message });
    });
};

const dislikeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      res
        .status(500)
        .send({ message: "Error unliking item", error: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
