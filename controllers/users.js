const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const DuplicateError = require("../utils/errors/DuplicateError");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

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
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError(e.message));
      } else if (e.code === 11000) {
        next(new DuplicateError(e.message));
      } else {
        next(e);
      }
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
        next(new UnauthorizedError(e.message));
      } else {
        next(e);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError(e.message));
      } else if (e.name === "CastError") {
        next(new BadRequestError(e.message));
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
        next(new NotFoundError(e.message));
      } else if (e.name === "CastError") {
        next(new BadRequestError(e.message));
      } else if (e.name === "ValidationError") {
        next(new BadRequestError(e.message));
      } else {
        next(e);
      }
    });
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
