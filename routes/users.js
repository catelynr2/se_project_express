const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUpdateUser } = require("../middlewares/validation");
const authMiddleware = require("../middlewares/auth");

// CREATE
// router.post("/", createUser);

// READ
// router.get("/", getUsers);
// router.get("/:userId", getUser);
router.get("/me", authMiddleware, getCurrentUser);

// UPDATE
router.patch("/me", authMiddleware, validateUpdateUser, updateUser);

module.exports = router;
