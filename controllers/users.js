const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  NOT_FOUND,
  BAD_REQUEST,
  DEFAULT,
  DUPLICATE,
  UNAUTHORIZED,
} = require("../utils/errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((newUser) => {
      res.send({
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    })
    // User.create({ name, avatar, email, password })
    //  .then((user) => {
    //   res.send(user);
    // })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid ID passed.",
        });
        // return res
        // .status(BAD_REQUEST)
        // .send({ message: "Invalid request from createUser" });
      } else if (e.code === 11000) {
        res.status(DUPLICATE).send({
          message: "Email already exists.",
        });
      } else {
        next(e);
      }
      return res.status(DEFAULT).send({ message: "Error from createUser" });
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((e) => {
      if (e.message === "Incorrect email or password") {
        res.status(UNAUTHORIZED).send({
          message: "Incorrect email address or password.",
        });
      } else {
        next(e);
      }
      return res.status(DEFAULT).send({ message: "Error from loginUser" });
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message:
            "There is no user with the requested id, or the request was sent to a non-existent address.",
        });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid ID passed.",
        });
      } else {
        next(e);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { $set: { name, avatar } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((userInfo) => res.send({ data: userInfo }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message:
            "There is no user with the requested id, or the request was sent to a non-existent address.",
        });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid ID passed.",
        });
      } else if (e.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid ID passed.",
        });
      } else {
        next(e);
      }
    });
};

module.exports = {
  createUser,
  // getUsers,
  // getUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
