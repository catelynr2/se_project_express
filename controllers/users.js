const User = require("../models/user");
const { DEFAULT } = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      console.error(e);
      res.status(DEFAULT).send({ message: "Error from createUser", e });
    });
};

const getUsers = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      res.status(DEFAULT).send({ message: "Error from getUsers", e });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((e) => {
      res.status(DEFAULT).send({ message: "Error from getUser", e });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
};
