const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createUser = (req, res) => {
  console.log(req.body);
  const { name, avatar } = req.body;
  User.create({ name, avatar })
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
    .orFail(() => {
      const error = new Error("User ID Not Found");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Invalid user ID" });
      } else {
        res.status(500).send({ message: "An error occurred on the server" });
      }
    });
};

module.exports = { getUsers, createUser, getUserById };
