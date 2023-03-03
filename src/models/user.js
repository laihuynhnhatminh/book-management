// Dependencies
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const { PASSWORD_REGEX } = require("../utils/common/regex");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validator(value) {
      if (!validator.isEmail(value)) throw new Error("Email is invalid");
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (!value.match(PASSWORD_REGEX)) throw new Error("Password is invalid");
    },
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: String,
  },
  role_id: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Remove sensitive datas from user JSON file
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.role_id;
  delete userObject.enabled;

  return userObject;
};

// Generate jwt token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// Get user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  if (user.password !== password) {
    throw new Error("Unable to login");
  }
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
