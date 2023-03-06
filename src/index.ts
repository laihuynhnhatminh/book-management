// Depenedencies
import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import 'express-async-errors';

dotenv.config();

// Type, interface
import { router as userRoutes } from './routes/user';
import { router as bookRoutes } from './routes/book';

// DB init
import { connectingToMongoDB } from './db/mongoose';
import { handleAuthentication } from './middlewares/authentication';
import { errorHandler } from './middlewares/error-handling';
connectingToMongoDB();

const app = express();
const port = process.env.PORT;

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Authentication middlewares
app.use(
  '/books',
  handleAuthentication.userAuthentication,
  handleAuthentication.getUserRole
);

// Routes
app.use(userRoutes);
app.use(bookRoutes);

// Error handlers
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
