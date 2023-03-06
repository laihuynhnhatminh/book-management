import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import 'express-async-errors';

dotenv.config();

import { router as userRoutes } from './routes/user';
import { router as bookRoutes } from './routes/book';
import { handleAuthentication } from './middlewares/authentication';
import { errorHandler } from './middlewares/error-handler';

import { connectingToMongoDB } from './db/mongoose';
connectingToMongoDB();

const app = express();
const port = process.env.PORT;

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  '/books',
  handleAuthentication.userAuthentication,
  handleAuthentication.getUserRole
);

app.use(userRoutes);
app.use(bookRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
