// src/pages/Portfolio.jsx
import React, { useState, useEffect } from "react";
import { Table, Card } from "react-bootstrap";
import axios from "axios";
import {LineChart, Line, XAxis, YAxis, Tooltip, 
        ResponsiveContainer, CartesianGrid, } from "recharts";

const Portfolio = () => {

  const userJohnAssets = [
    { ticker: 'AAPL', name:'Apple', quantity: 20 },
    { ticker: 'BTC', name:'Bitcoin', quantity: 0.1 },
    { ticker: 'VOO', name:'Vanguard S&P 500 ETF', quantity: 10 },
  ];

                const [symbol, setSymbol] = useState('');
                const [price, setPrice] = useState({});
                const [percentChange, setPercentChange] = useState({});
                const [error, setError] = useState(null);
                const [chartData, setChartData] = useState([]);
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Space out requests
                useEffect(() => {
                  const fetchPrice = async () => {
                    // For Portfolio value and percent change
                    const newPrices = {};
                    const newPercentChanges = {}
                    
                    // For day chart
                    const portfolioData = {};
                    const datesSet = new Set();

                    try {
                      for (const asset of userJohnAssets) {
                        let symbol = asset.ticker;
                        const isCrypto = (ticker) => {
                          const cryptoTickers = ['BTC', 'ETH', 'DOGE', 'SOL', 'ADA', 'XRP', 'BNB'];
                          return cryptoTickers.includes(ticker.toUpperCase());
                        };
                        
                        const isCryptoAsset = isCrypto(asset.ticker);
                        if (isCryptoAsset) {
                          symbol = `BINANCE:${asset.ticker}USDT`;
                        }

                        const url = `http://localhost:5000/api/asset/${symbol}`;
                        const response = await axios.get(url);
                        console.log(`Response for ${symbol}:`, response.data);
                        newPrices[asset.ticker] = Number(response.data.c);

                        // Calculate percent change
                        const currentPrice = Number(response.data.c);
                        const previousClose = Number(response.data.pc);
                        const percentChange = previousClose
                        ? ((currentPrice - previousClose) / previousClose) * 100
                        : 0;
                        newPercentChanges[asset.ticker] = Number(percentChange);

                        // For charting
                        symbol = isCryptoAsset ? `${asset.ticker}-USD` : asset.ticker;
                        const res = await axios.get(`http://localhost:5000/api/stock/${symbol}/history`);
                        console.log(`Response for ${symbol}:`, res.data);
                        const history = res.data;

                        let lastValid = null;
                        history.forEach(entry => {
                        
                          const value = entry.price * asset.quantity;
                          const date = entry.date;

                          if (!datesSet.has(date)) datesSet.add(date);
                          if (!portfolioData[date]) {
                            portfolioData[date] = 0;
                          }
                          portfolioData[date] += value;
                        });
                      }
                      // Also for charting
                      const formatted = Array.from(datesSet)
                      .sort((a, b) => new Date(a) - new Date(b)) // Sort by actual date
                      .map(date => ({
                        date,
                        totalValue: Number(portfolioData[date].toFixed(2)),
                      }));
                      setChartData(formatted);
                
                      setPrice(newPrices);
                      setPercentChange(newPercentChanges);

                      setError(null);
                    } catch (err) {
                      console.error('Error fetching prices:', err);
                      setError('Failed to load asset prices');
                    }
                    await delay(750); // space requests out
                  };
                  fetchPrice();
                  const interval = setInterval(fetchPrice, 4000); // Pulls prices every 4 seconds
                  return () => clearInterval(interval);
                }, []);

                const getChangeClass = (change) => {
                  if (change > 0) return 'text-success';
                  if (change < 0) return 'text-danger';
                  return 'text-muted';
                };
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

                return (
                  <tr key={index}>
                    <td>{asset.name} ({asset.ticker})</td>
                    <td>{type}</td>
                    <td>{asset.quantity}</td>
                    <td> {typeof price[asset.ticker] === 'number'
                          ? `$${(price[asset.ticker] * asset.quantity).toFixed(2)}`
                          : 'Loading...'}</td>
                    <td className={getChangeClass(percentChange[asset.ticker])}>{typeof percentChange[asset.ticker] === 'number'
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
      <div style={{ width: "100%", height: "300px" }}>
        {chartData.length === 0 ? (
          <p className="text-muted">Loading or no data...</p>
        ) : (
          <ResponsiveContainer width="100%" height="120%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[
                  (dataMin) => Math.max(0, dataMin * 0.997),
                  (dataMax) => dataMax * 1.003
                ]}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalValue"
                stroke="#00b894"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
