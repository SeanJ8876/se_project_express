const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  DEFAULT,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    return res
      .status(DEFAULT)
      .send({ message: "An error occurred on the server" });
  }
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({
      message: "Email and password are required",
    });
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        avatar,
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      })
    )
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      return res.status(201).send(userResponse);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided when creating a user." });
      }
      if (err.code === 11000) {
        return res
          .status(CONFLICT)
          .send({ message: "A user with this email already exists." });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error occurred on the server" });
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

  return User.findUserByCredentials(normalizedEmail, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ message: "Login successful", user, token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Invalid email or password" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error occurred on the server" });
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
