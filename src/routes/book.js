// Import libraries
const express = require("express");

// Import Middleware
const auth = require("../middlewares/auth");

// Import Controllers
const BookController = require("../controllers/book");

const router = express.Router();

// POST /books - Create a new book
router.post("/books", auth.userAuthentication, BookController.createNewBook);

// title, author, description, image(not always needed)

// PATCH /books/:id - Edit a book
router.patch("/books/:id", auth.userAuthentication, BookController.editBook);
// title, author, description, image(not always needed), enabled

// GET /books  - for all users (including guest)
// Guest => can only access enabled book
// User => can only access owned disabled book
// Admin => all books
// Param: title, author, enabled, pagination, sortBy
router.get("/books", auth.userAuthentication, BookController.getBooks);

// GET /books/:id - Get a specific book by id
// Admin can get all books
// User can only get their book or just get enabled books
// Guest can only get enabled books
router.get(
  "/books/:id",
  auth.userAuthentication,
  BookController.getSpecificBook
);
// DELETE /books/:id - Delete a book by id
// Admin can delete all books
// User can only delete their book
router.delete(
  "/books/:id",
  auth.userAuthentication,
  BookController.deleteSpecificBook
);

module.exports = router;
