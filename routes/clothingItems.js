const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", authMiddleware, createItem);

// Read
router.get("/", getItems);

// Update
// router.put("/:itemId", updateItem);
router.put("/:itemId/likes", authMiddleware, likeItem);

// Delete
router.delete("/:itemId", authMiddleware, deleteItem);
router.delete("/:itemId/likes", authMiddleware, dislikeItem);

module.exports = router;
