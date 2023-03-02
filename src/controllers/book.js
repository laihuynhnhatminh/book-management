// import Models
const Book = require("../models/book");
const GetBookService = require("../services/get-book");
const VerifyUserService = require("../services/verify-user");
const Utils = require("../utils/utils");

module.exports = {
  createNewBook: async (req, res) => {
    try {
      await VerifyUserService.isGuest(req, res);
      const book = await new Book({
        ...req.body,
        user_id: req.user._id,
      }).save();

      res.status(201).send({
        success: true,
        data: {
          message: "New book created successfully",
          book,
        },
      });
    } catch (error) {
      res
        .status(error.code || 400)
        .send({ success: false, data: { error: error.message } });
    }
  },

  editBook: async (req, res) => {
    const allowedUpdateFields = [
      "title",
      "author",
      "description",
      "image",
      "enabled",
    ];
    const isValidOperation = Object.keys(req.body).every((k) =>
      allowedUpdateFields.includes(k)
    );
    if (!isValidOperation) {
      return res
        .status(403)
        .send({ success: false, data: { error: "Operation not allowed" } });
    }

    try {
      await VerifyUserService.isGuest(req, res);
      const book = await Book.findOne({
        _id: req.params.id,
        user_id: req.user._id,
      });

      if (!book) {
        return res.status(404).send({ success: false });
      }

      Object.keys(req.body).forEach((k) => (book[k] = req.body[k]));
      await book.save();

      res.send({ success: true, data: book });
    } catch (error) {
      res
        .status(error.code || 400)
        .send({ success: false, data: { error: error.message } });
    }
  },

  getBooks: async (req, res) => {
    const userRole = await VerifyUserService.checkUserRole(req, res);
    const filters = {};
    const sort = {};
    // Update sort and filters from query
    Object.keys(req.query).forEach((k) => {
      if (k === "sortBy") {
        const parts = req.query.sortBy.split("_");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
      }
      if (k !== "limit" || k !== "skip" || k !== "sortBy") {
        if (k === "enabled") {
          filters[k] = filters[k] === "true" ? true : false;
        } else {
          filters[k] = Utils.toLowerCaseFilter(req.query[k]);
        }
      }
    });
    console.log(filters);
    try {
      const books = await GetBookService.getBookList(
        req,
        res,
        filters,
        sort,
        userRole
      );
      res.send(books);
    } catch (error) {
      res.status(400).send({ success: false, data: { error: error.message } });
    }
  },

  getSpecificBook: async (req, res) => {
    const userRole = await VerifyUserService.checkUserRole(req, res);
    try {
      const book = await GetBookService.getSpecificBook(req, res, userRole);
      if (!book) {
        return res.status(404).send({ success: false });
      }
      res.send({ success: true, data: book });
    } catch (error) {
      res.status(400).send({ success: false, data: { error: error.message } });
    }
  },

  deleteSpecificBook: async (req, res) => {
    const userRole = await VerifyUserService.checkUserRole(req, res);
    try {
      await VerifyUserService.isGuest(req, res);
      const book = await GetBookService.getSpecificBook(req, res, userRole);
      if (!book) {
        return res.status(404).send({ success: false });
      }
      book.remove();
      res.send({ success: true, data: { message: "Remove successfully" } });
    } catch (error) {
      res
        .status(error.code || 400)
        .send({ success: false, data: { error: error.message } });
    }
  },
};
