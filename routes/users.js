const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

// CREATE
router.post("/", createUser);

// READ
router.get("/", getUsers);
router.get("/:userId", getUser);

module.exports = router;
