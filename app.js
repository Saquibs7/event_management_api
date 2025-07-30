require('dotenv').config();
const express = require('express');
const { errorHandler } = require('./utils/errors');

const eventRoutes = require('./routes/eventRoutes');
const userRoutes  = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
