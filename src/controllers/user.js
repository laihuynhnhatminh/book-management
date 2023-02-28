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
      res.status(400).send({ success: false, error: error });
    }
  },

  getAllUser: async (req, res) => {
    try {
      const userList = await User.find();
      console.log(userList);
      if (!userList) {
        throw new Error("User not found");
      }
      res.send({ success: true, data: userList });
    } catch (error) {
      res.status(500).send({ success: false, error: error });
    }
  },

  getUserProfile: async (req, res) => {
    res.send({ success: true, data: { user: req.user, token: req.token } });
  },
};
