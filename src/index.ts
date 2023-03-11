import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import 'express-async-errors';

dotenv.config();

import routes from './routes/routes';
import { handleAuthentication } from './middlewares/authentication';
import { errorHandler } from './middlewares/error-handler';

import { connectingToMongoDB } from './db/mongoose';

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

connectingToMongoDB();
routes(app);

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Listening to port ${port}`);
});
