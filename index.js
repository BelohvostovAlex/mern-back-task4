import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import authRouter from './routers/authRouter.js';
import statusRouter from './routers/statusRouter.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}));
app.use('/auth', authRouter);
app.use('/status', statusRouter);

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB_URL);
		app.listen(PORT, () => console.log(`Server started on ${PORT}`));
	} catch (error) {
		console.log(error);
	}
};

start();
