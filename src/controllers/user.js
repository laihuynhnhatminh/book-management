// Models
const User = require("../models/user");

// Services
const VerifyUserService = require("../services/verify-user");

// Utils
const { customErrorHandler } = require("../utils/handle-error");

module.exports = {
  userLogin: async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );

      if (user.enabled === false) {
        customErrorHandler("User account is disabled", 403);
      }

      const token = await user.generateAuthToken();
      res.send({ success: true, data: { token } });
    } catch (error) {
      res
        .status(error.code || 400)
        .send({ success: false, data: { error: error.message } });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      await VerifyUserService.isGuest(req, res);
      res.send({ success: true, data: { user: req.user, token: req.token } });
    } catch (error) {
      res
        .status(error.code || 400)
        .send({ success: false, data: { error: error.message } });
    }
  },
};
