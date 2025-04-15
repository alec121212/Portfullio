import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { addNewUser, getAllUsers } from './utils/userUtils';
import { UserData } from './Models/User';
import cors from "cors";
import dotenv from 'dotenv';

const app = express();
const port = 5000;
dotenv.config(); 

app.use(bodyParser.json());
app.use(cors());

const finnhub = require('finnhub');

app.get('/users', (req: Request, res: Response) => {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/users', (req: Request, res: Response) => {
  const { name, walletAddress }: UserData = req.body;

  if (!name || !walletAddress) {
    res.status(400).json({ error: 'Name and wallet address are required' });
    return;
  }

  const newUser: UserData = { name, walletAddress };

  try {
    addNewUser(newUser);
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_KEY as string; // .env variable
const finnhubClient = new finnhub.DefaultApi();

app.get("/api/stock/:symbol", async (req, res) => {
  try {
      const { symbol } = req.params;
      console.log(`Fetching stock data for: ${symbol}`);

      const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_KEY}`,
          { timeout: 5000 } // 5-second timeout
      );

      res.json(response.data);
  } catch (error) {
      console.error("Error fetching stock data:", error);
      res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.get("/api/stock/:symbol/history", async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1y`
    );

    const timestamps = response.data.chart.result[0].timestamp;
    const prices = response.data.chart.result[0].indicators.quote[0].close;

    const formattedData = timestamps.map((timestamp: number, i: string | number) => ({
      date: new Date(timestamp * 1000).toLocaleDateString("en-US"),
      price: prices[i],
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock history" });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
