const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const { NOT_FOUND } = require("../utils/errors");
const { createUser, loginUser } = require("../controllers/users");

router.use("/items", clothingItems);
router.use("/users", users);

router.post("/signup/", createUser);
router.post("/signin/", loginUser);

router.use((req, res, next) => {
  next(new NOT_FOUND("Requested resource not found"));
});

module.exports = router;
