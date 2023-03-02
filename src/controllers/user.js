const VerifyUserService = require("../services/verify-user");
const User = require("../models/user");

module.exports = {
  userLogin: async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );
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
