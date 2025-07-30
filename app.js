import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { errorHandler } from './utils/errorHandler.js';
import eventRoutes from './routes/events.js';
import userRoutes from './routes/users.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
