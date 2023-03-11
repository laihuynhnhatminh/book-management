---

**ABOUT THIS PROJECT**:

- This project is a simple book management project containing API to interact (basic CRUD) with books management website.

**BUILD WITH**:

- Express
- MongoDB - Mongoose

**GETTING START**  
Installing dependencies:

```
npm install
```

Basic commands for local start up:

```
npm run start-dev
```

Docker compose

```
docker compose up
```

Docker including init data for testing purposes:

- Users: user(enabled), user(disabled) and admin
- User role: guest, user and admin
- Books: books created by admin/user (some are enabled and some are disabled)

REST API:
users URI

```
POST /users - user login with email and password
GET /users/me - fetch logged in user profile (for testing purposes)
```

books URI

```
POST /books - create books (user and admin only) (required field - title, author) (optional field - description, enabled, image)
PATCH /books/:id - update book by book id (user owned books and admin only) (optional field - title, author, description, enabled, image)
GET /books - fetch all books (guest, user and admin) (query parameters - limit, skip, sortBy, title, author, enabled)
GET /books/:id - fetch book by id (user owned books and admin only)
DELETE /books/:id - delete book by id (user owned books and admin only)
```

Books URI query parameters:

```
limit - number of books to displayed (default 10)
skip - number of books to skip (default 0)
sortBy -  number of books to sort by certain field (author, title)
- For example GET /books?sortBy=author_asc => return list of books ordered in ascending order by author field
title - query books by title
author - query books by author
enabled - query books by whether they are enabled or not
```
