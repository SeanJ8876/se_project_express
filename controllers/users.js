const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

const {
  DEFAULT,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(DEFAULT).send({ message: err.message }));
};

const bcrypt = require("bcryptjs");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({
      message: "Email and password are required",
    });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
        name,
        avatar,
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      });
    })
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      return res.status(201).send(userResponse);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided when creating a user." });
      } else if (err.code === 11000) {
        res
          .status(CONFLICT)
          .send({ message: "A user with this email already exists." });
      } else {
        res.status(DEFAULT).send({ message: err.message });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({
      message: "Email and password are required",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  User.findUserByCredentials(normalizedEmail, password) // Use normalizedEmail here!
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ message: "Login successful", user, token });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: "Invalid email or password" });
    });
};

const editUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
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
  const { _id } = req.user;
  User.findById(_id)
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
  login,
  editUserProfile,
};
