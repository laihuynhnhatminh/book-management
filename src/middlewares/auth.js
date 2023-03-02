const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {
  userAuthentication: async (req, res, next) => {
    if (!req.headers.authorization) {
      return next();
    }
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
      if (!user || user.enabled === false) {
        throw new Error();
      }

      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ success: false, data: { error: "Please authenticate." } });
    }
  },
};
