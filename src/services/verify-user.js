const User = require("../models/user");
const ErrorHandler = require("../utils/handle-error");
const { UserRoleEnum } = require("../utils/common/enum");

async function getUserRole(req, res) {
  return User.aggregate([
    {
      $lookup: {
        from: "roles",
        localField: "role_id",
        foreignField: "_id",
        as: "role",
      },
    },
    { $project: { _id: 1, email: 1, role: 1 } },
    { $unwind: "$role" },
  ]).match({ _id: req.user._id });
}

module.exports = {
  checkUserRole: async (req, res) => {
    if (!req.user) {
      return UserRoleEnum.GUEST;
    }

    const user = await getUserRole(req, res);
    return user[0].role.name;
  },

  isGuest: async (req, res) => {
    if (!req.user) {
      ErrorHandler.customErrorHandler("Please authenticate", 401);
    }
  },
};
