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

app.get("/api/asset/:symbol", async (req, res) => {
  try {
      const { symbol } = req.params;
      console.log(`Fetching stock data for: ${symbol}`);

      const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_KEY}`,
          { timeout: 5000 }
      );

      res.json(response.data);
  } catch (error) {
      console.error("Error fetching stock data:", error);
      res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.get("/api/asset/:symbol", async (req, res) => {
  try {
      const { symbol } = req.params;
      console.log(`Fetching crypto data for: ${symbol}`);

      const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_KEY}`,
          { timeout: 5000 }
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
      `https://query1.finance.yahoo.com/v7/finance/chart/${symbol}?interval=5m&range=1d`
    );

    const timestamps = response.data.chart.result[0].timestamp;
    const prices = response.data.chart.result[0].indicators.quote[0].close;
    //logic for bad prices
    let lastValidPrice: number | null = null;

    const formattedData = timestamps.map((timestamp: number, i: number) => {
      let price = prices[i];

      if (price === null || price === 0) {
        price = lastValidPrice;
      } else if (lastValidPrice !== null) {
        const percentChange = Math.abs((price - lastValidPrice) / lastValidPrice) * 100;
        if (percentChange > 99.5) {
          // sudden drop or spike — considered invalid
          price = lastValidPrice;
        } else {
          lastValidPrice = price;
        }
      } else {
        // First valid price
        lastValidPrice = price;
      }

      return {
        date: new Date(timestamp * 1000).toLocaleTimeString("en-US", {
          hour: '2-digit',
          minute: '2-digit',
        }),
        price,
      };
    });

    res.json(formattedData);
  } catch (error) { 
    res.status(500).json({ error: "Failed to fetch stock history" });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
