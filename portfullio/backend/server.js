import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongoDB.js'
import plaidRoutes from './routes/plaidRoutes.js';
import finnhubRoutes from './routes/finnhubRoutes.js'

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/plaid', plaidRoutes);
app.use('/api', finnhubRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));