// Depenedencies
import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();

// Type, interface
import { router as userRoutes } from './routes/user';
import { router as bookRoutes } from './routes/book';

// DB init
import { connectingToMongoDB } from './db/mongoose';
connectingToMongoDB();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(userRoutes);
app.use(bookRoutes);

app.listen(port, () => {
	console.log(`Listening to port ${port}`);
});
