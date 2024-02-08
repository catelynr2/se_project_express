const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const NotFoundError = require("../utils/errors/NotFoundError");
const { createUser, loginUser } = require("../controllers/users");
const { validateNewUser, validateLogin } = require("../middlewares/validation");

router.use("/items", clothingItems);
router.use("/users", users);

router.post("/signup/", validateNewUser, createUser);
router.post("/signin/", validateLogin, loginUser);

router.use((req, res, next) => {
  console.log(res);
  return next(new NotFoundError("Requested resourse not found"));
});

module.exports = router;
