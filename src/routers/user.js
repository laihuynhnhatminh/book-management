const express = require("express");
const auth = require("../middlewares/auth");

// Import model
const UserController = require("../controllers/user");

const router = express.Router();

// For testing purposes
// GET /users - get all users
router.get("/users", auth, UserController.getAllUser);

// TODO
// POST /user/login with authentication
router.post("/user/login", UserController.userLogin);

// GET /user/me with authentication
router.get("/user/me", auth, UserController.getUserProfile);

module.exports = router;
