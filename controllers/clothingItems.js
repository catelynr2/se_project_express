const ClothingItem = require("../models/clothingItem");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl, likes } = req.body;

  ClothingItem.create({ name, weather, imageUrl, likes, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError(e.message));
      } else {
        next(e);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((e) => {
      next(e);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError(e.message);
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
    })

    .catch((e) => {
      if (e.name === "CastError") {
        next(new BadRequestError(e.message));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError(e.message));
      } else {
        next(e);
      }
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
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

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
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

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
