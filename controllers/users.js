const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Invalid data provided when creating a user." });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new Error("NotFound"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "NotFound") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports = { getUsers, createUser, getUserById };
