// Models
const Book = require("../models/book");

// Utils
const { UserRoleEnum } = require("../utils/common/enum");

module.exports = {
  getBookList: async (req, res, filters, sort, userRole) => {
    let query = {};
    switch (userRole) {
      case UserRoleEnum.USER:
        query = {
          $and: [
            {
              $or: [{ user_id: req.user._id }, { enabled: true }],
              ...filters,
            },
          ],
        };
        break;
      case UserRoleEnum.ADMIN:
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
      limit: req.query.limit || 10,
      skip: req.query.skip || 0,
      sort,
    });
  },

  getSpecificBook: async (req, res, userRole) => {
    let query = { _id: req.params.id };
    switch (userRole) {
      case UserRoleEnum.USER:
        query = {
          $and: [
            { $or: [{ user_id: req.user._id }, { enabled: true }] },
            query,
          ],
        };
        break;
      case UserRoleEnum.ADMIN:
        query = { ...query };
        break;
      default:
        query = { ...query, enabled: true };
    }
    return Book.findOne(query);
  },
};
