// Depenedencies
import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

// Type, interface
import { Request, Response } from 'express';

// DB init
import { connectingToMongoDB } from './db/mongoose';
connectingToMongoDB();

const app = express();
const port = process.env.PORT;

app.get('', (req: Request, res: Response) => {
	res.send('Hello world Ts');
});

app.listen(port, () => {
	console.log(`Listening to port ${port}`);
});
