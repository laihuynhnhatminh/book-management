const { db } = require("./src/models/user");

db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [
    {
      role: "readWrite",
      db: "book-management",
    },
  ],
});

db = db.getSiblingDB("book-management");
db.createCollection("users", { capped: false });

db.users.insertMany([
  {
    email: "minh@minh.com",
    password: "Minh123456",
    firstName: "Minh",
    lastName: "Nhat",
  },
  {
    email: "minhlai@minh.com",
    password: "Minh123456",
    firstName: "Minh",
    lastName: "Lai",
  },
]);

db.createCollection("roles", { capped: false });

db.roles.insertMany([
  {
    id: "1",
    role: "Administrator",
  },
  {
    id: "2",
    role: "User",
  },
]);
