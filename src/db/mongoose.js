// Dependencies
const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
  mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err.message);
    });

  mongoose.connection.on("connected", () => {
    console.log("Connecting...");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("disconnect", () => {
    console.log("Disconnected from MongoDB");
  });
};
