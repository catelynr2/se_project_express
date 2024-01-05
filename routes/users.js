const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");

// CREATE
// router.post("/", createUser);

// READ
// router.get("/", getUsers);
// router.get("/:userId", getUser);
router.get("/me", authMiddleware, getCurrentUser);

// UPDATE
router.patch("/me", authMiddleware, updateUser);

module.exports = router;
