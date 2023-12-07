const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req), console.log(req.body), console.log(req.user._id);

  const { name, weather, imageUrl, likes } = req.body;

  ClothingItem.create({ name, weather, imageUrl, likes, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } }
      .orFail()
      .then((item) => res.status(200).send({ data: item }))
      .catch((e) => {
        res.status(500).send({ message: "Error from updateItem", e });
      }),
  );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) =>
      res
        .status(204)
        .send({})
        .catch((e) => {
          res.status(500).send({ message: "Error from deleteItem", e });
        }),
    );
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
