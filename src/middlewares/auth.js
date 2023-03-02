const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {
  userAuthentication: async (req, res, next) => {
    if (!req.headers.authorization) {
      return next();
    }
    try {
      const authToken = req.header("Authorization").replace("Bearer ", "");
      const decoded = await jwt
        .verify(
          authToken,
          process.env.JWT_SECRET_KEY,
          async (error, decoded) => {
            // Handle token expiration
            if (error) {
              const user = await User.findOne({
                "tokens.token": authToken,
              });
              user.tokens = user.tokens.filter(
                (token) => token.token !== authToken
              );

              await user.save();
              throw new Error("Token expired");
            }
            return decoded;
          }
        )
        .then((res) => res);

      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": authToken,
      });
      if (!user || user.enabled === false) {
        throw new Error();
      }

      req.token = authToken;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({
        success: false,
        data: { error: error.message || "Please authenticate!" },
      });
    }
  },
};
