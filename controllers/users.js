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
        next(new BAD_REQUEST(e.message));
        // return res
        // .status(BAD_REQUEST)
        // .send({ message: "Invalid request from createUser" });
      } else if (e.code === 11000) {
        next(new DUPLICATE("Email already exists."));
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
        next(new UNAUTHORIZED("Incorrect email address or password."));
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
        next(
          new NOT_FOUND(
            "There is no user with the requested id, or the request was sent to a non-existent address",
          ),
        );
      } else if (e.name === "CastError") {
        next(new BAD_REQUEST("Invalid ID passed."));
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
        next(
          new NOT_FOUND(
            "There is no user with the requested id, or the request was sent to a non-existent address",
          ),
        );
      } else if (e.name === "CastError") {
        next(new BAD_REQUEST("Invalid ID passed."));
      } else if (e.name === "ValidationError") {
        next(new BAD_REQUEST("You must enter a valid URL."));
      } else {
        next(e);
      }
    });
};

// const getUsers = (req, res) => {
//   User.find(req.params.id)
//     .then((users) => {
//       res.status(200).send(users);
//     })
//     .catch((e) => {
//       console.error(e);
//       res.status(DEFAULT).send({ message: "Error from getUsers" });
//     });
// };

// const getUser = (req, res) => {
//   User.findById(req.params.userId)
//     .orFail()
//     .then((user) => {
//       res.status(200).send(user);
//     })
//     // .catch((e) => {
//     //   res.status(DEFAULT).send({ message: "Error from getUser" });
//     // });
//     .catch((e) => {
//       console.error(e);
//       if (e.name === "DocumentNotFoundError") {
//         res.status(NOT_FOUND).send({
//           message:
//             "There is no user with the requested id, or the request was sent to a non-existent address",
//         });
//       } else if (e.name === "CastError") {
//         res.status(BAD_REQUEST).send({
//           message: "Invalid ID passed",
//         });
//       } else {
//         res.status(DEFAULT).send({
//           message: "An error has occurred on the server",
//         });
//       }
//     });
// };

module.exports = {
  createUser,
  // getUsers,
  // getUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
