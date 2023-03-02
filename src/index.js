const express = require("express");
require("dotenv").config();

// Init Db
require("./db/mongoose")();

// Routers
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRoutes);
app.use(bookRoutes);

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
