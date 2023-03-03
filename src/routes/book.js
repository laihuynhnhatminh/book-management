// Dependencies
const express = require("express");

// Middleware
const auth = require("../middlewares/auth");

// Controllers
const BookController = require("../controllers/book");

const router = express.Router();

// POST /books - Create a new book - title, author, description, image(not always needed)
router.post("/books", auth.userAuthentication, BookController.createNewBook);

// PATCH /books - Create a new book - title, author, description, image(not always needed)
router.patch("/books/:id", auth.userAuthentication, BookController.editBook);

// GET /books  - for all users (including guest)
// Param: title, author, enabled, pagination, sortBy
router.get("/books", auth.userAuthentication, BookController.getBooks);

// GET /books/:id - Get a specific book by id
router.get(
  "/books/:id",
  auth.userAuthentication,
  BookController.getSpecificBook
);

// DELETE /books/:id - Delete a book by id
router.delete(
  "/books/:id",
  auth.userAuthentication,
  BookController.deleteSpecificBook
);

module.exports = router;
