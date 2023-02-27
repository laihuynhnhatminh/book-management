const express = require("express");
require("dotenv").config();
require("./db/mongoose");

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
