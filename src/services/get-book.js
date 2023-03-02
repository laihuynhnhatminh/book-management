const Book = require("../models/book");

module.exports = {
  getBookList: async (req, res, filters, sort, userRole) => {
    let query = {};
    switch (userRole) {
      case "User":
        query = {
          $and: [
            {
              $or: [{ user_id: req.user._id }, { enabled: true }],
              ...filters,
            },
          ],
        };
        break;
      case "Admin":
        query = {
          ...filters,
        };
        break;
      default:
        query = {
          ...filters,
          enabled: true,
        };
    }

    return Book.find(query, null, {
      limit: req.query.limit,
      skip: req.query.skip,
      sort,
    });
  },

  getSpecificBook: async (req, res, userRole) => {
    let query = { _id: req.params.id };
    switch (userRole) {
      case "User":
        query = {
          $and: [
            { $or: [{ user_id: req.user._id }, { enabled: true }] },
            query,
          ],
        };
        break;
      case "Admin":
        query = {};
        break;
      default:
        query = { ...query, enabled: true };
    }
    return Book.findOne(query);
  },
};
