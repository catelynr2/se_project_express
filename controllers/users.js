const User = require("../models/user");
const { NOT_FOUND, BAD_REQUEST, DEFAULT } = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request from createUser" });
      }
      return res.status(DEFAULT).send({ message: "Error from createUser" });
    });
};

const getUsers = (req, res) => {
  User.find(req.params.id)
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      console.error(e);
      res.status(DEFAULT).send({ message: "Error from getUsers" });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    // .catch((e) => {
    //   res.status(DEFAULT).send({ message: "Error from getUser" });
    // });
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({
          message:
            "There is no user with the requested id, or the request was sent to a non-existent address",
        });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid ID passed",
        });
      } else {
        res.status(DEFAULT).send({
          message: "An error has occurred on the server",
        });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
};
