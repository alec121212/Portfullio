import express from 'express'
import cors from 'cors'
import plaidRoutes from './routes/plaid.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/plaid', plaidRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));