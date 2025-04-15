// src/pages/Portfolio.jsx
import React, { useState, useEffect } from "react";
import { Table, Card } from "react-bootstrap";
import axios from "axios";

const Portfolio = () => {

  const userJohnAssets = [
    { ticker: 'AAPL', name:'Apple', quantity: 20 },
    { ticker: 'BTC', name:'Bitcoin', quantity: 0.75 },
    { ticker: 'VOO', name:'Vanguard S&P 500 ETF', quantity: 10 },
  ];

                const [symbol, setSymbol] = useState('');
                const [price, setPrice] = useState({});
                const [percentChange, setPercentChange] = useState({});
                const [error, setError] = useState(null);
                useEffect(() => {
                  const fetchPrice = async () => {
                    const newPrices = {};
                    const newPercentChanges = {}

                    try {
                      for (const asset of userJohnAssets) {
                        let symbol = asset.ticker;
                        const isCrypto = asset.ticker === 'BTC';

                        if (isCrypto) {
                          symbol = `BINANCE:${asset.ticker}USDT`;
                        }
                
                        const url = `http://localhost:5000/api/asset/${symbol}`;
                        const response = await axios.get(url);
                        newPrices[asset.ticker] = Number(response.data.c);

                        // Calculate percent change
                        const currentPrice = Number(esponse.data.c);
                        const previousClose = Number(response.data.pc);
                        const percentChange = previousClose
                        ? ((currentPrice - previousClose) / previousClose) * 100
                        : 0;
                        newPercentChanges[asset.ticker] = Number(percentChange);
                      }
                
                      setPrice(newPrices);
                      setPercentChange(newPercentChanges);

                      setError(null);
                    } catch (err) {
                      console.error('Error fetching prices:', err);
                      setError('Failed to load asset prices');
                    }
                    await delay(750); // space requests out
                    console.log(`Response for ${symbol}:`, response.data);
                  };
                  fetchPrice();
                  const interval = setInterval(fetchPrice, 4000); // Pulls prices every 4 seconds
                  return () => clearInterval(interval);
                }, []);
  return (
    <div className="container">
      <h2 className="fw-bold mb-4 text-primary">My Portfolio</h2>
      <Card className="shadow-sm border-0">
      <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Value</th>
                <th>Change (24h)</th>
              </tr>
            </thead>
            <tbody>
              {userJohnAssets.map((asset, index) => {
                // Hardcoded type for now
                let type = 'Stock';
                if (asset.ticker === 'BTC') type = 'Crypto';
                

                // Hardcoded for now
                const value = '$3,000';
                const change = '+1.2%';
                const changeClass = (percentChange[asset.ticker]).toFixed(2).includes('-') ? 'text-danger' : 'text-success';

                return (
                  <tr key={index}>
                    <td>{asset.name} ({asset.ticker})</td>
                    <td>{type}</td>
                    <td>{asset.quantity}</td>
                    <td> {typeof price[asset.ticker] === 'number'
                          ? `$${(price[asset.ticker] * asset.quantity).toFixed(2)}`
                          : 'Loading...'}</td>
                    <td className={changeClass}>{typeof percentChange[asset.ticker] === 'number'
                          ? `${(percentChange[asset.ticker]).toFixed(2)}%`
                          : 'Loading...'}
                        </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Portfolio;
