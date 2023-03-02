const express = require("express");
const auth = require("../middlewares/auth");

// Import model
const UserController = require("../controllers/user");

const router = express.Router();

// POST /users/login with authentication
router.post("/users/login", UserController.userLogin);

// GET /users/me with authentication
router.get("/users/me", auth.userAuthentication, UserController.getUserProfile);

module.exports = router;
