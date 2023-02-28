const express = require("express");
require("dotenv").config();

// Init Db
require("./db/mongoose")();

// Routers
const userRouter = require("./routers/user");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);

app.get("", (req, res) => {
  res.send({ message: "Hello, world!" });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
