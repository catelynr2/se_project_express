const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  validateClothingItem,
  validateLikeItem,
  validateDeleteItem,
  validateDislikeItem,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", authMiddleware, validateClothingItem, createItem);

// Read
router.get("/", getItems);

// Update
// router.put("/:itemId", updateItem);
router.put("/:itemId/likes", authMiddleware, validateLikeItem, likeItem);

// Delete
router.delete("/:itemId", authMiddleware, validateDeleteItem, deleteItem);
router.delete(
  "/:itemId/likes",
  authMiddleware,
  validateDislikeItem,
  dislikeItem,
);

module.exports = router;
