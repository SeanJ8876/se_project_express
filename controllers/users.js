const User = require("../models/user");
const { DEFAULT, BAD_REQUEST, NOT_FOUND } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(DEFAULT).send({ message: err.message }));
};

const bcrypt = require("bcryptjs");

const createUser = (req, res) => {
  console.log(req.body);
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.create({ name, avatar, email, password: hashedPassword });
    })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided when creating a user." });
      } else if (err.code === 11000) {
        res
          .status(409)
          .send({ message: "A user with this email already exists." });
      } else {
        res.status(DEFAULT).send({ message: err.message });
      }
    });
};

const createLogin = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ message: "Login successful", user, token });
    })
    .catch((err) => {
      res.status(401).send({ message: "Invalid email or password" });
    });
};

const editUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(userId, { name, avatar }, { new: true })
    .then((user) => {
      if (!user) {
        const error = new Error("User ID Not Found");
        error.statusCode = NOT_FOUND;
        throw error;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      } else {
        res
          .status(DEFAULT)
          .send({ message: "An error occurred on the server" });
      }
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID Not Found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      } else {
        res
          .status(DEFAULT)
          .send({ message: "An error occurred on the server" });
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  createLogin,
  editUserProfile,
};
