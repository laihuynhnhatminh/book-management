import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

export function connectingToMongoDB(): void {
	mongoose
		.connect(process.env.MONGO_DB_URI as string)
		.then(() => {
			console.log('Connected to MongoDB');
		})
		.catch((err) => {
			console.log(err.message);
		});

	mongoose.connection.on('connected', () => {
		console.log('Connecting...');
	});

	mongoose.connection.on('error', (err) => {
		console.log(err.message);
	});

	mongoose.connection.on('disconnect', () => {
		console.log('Disconnected from MongoDB');
	});
}
