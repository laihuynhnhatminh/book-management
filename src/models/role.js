// Dependencies
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
