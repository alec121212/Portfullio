import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Portfolio = () => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [cryptoSymbol, setCryptoSymbol] = useState("");
  const [stockPrice, setStockPrice] = useState(null);
  const [cryptoPrice, setCryptoPrice] = useState(null);
  const [stockChartData, setStockChartData] = useState([]);
  const [cryptoChartData, setCryptoChartData] = useState([]);
  const [stockError, setStockError] = useState(null);
  const [cryptoError, setCryptoError] = useState(null);
  const [chartData, setChartData] = useState([]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchAssetData = async (symbol) => {
    try {
      console.log("Fetching asset data for:", symbol);

      // Format symbol for API query
      const querySymbol = symbol.includes("-") ? `BINANCE:${symbol}USDT` : symbol;

      const assetRes = await axios.get(
        `http://localhost:5000/api/finnhub/asset/${querySymbol}`
      );
      console.log("Asset response:", assetRes.data);

      const price = assetRes.data.c;

      const chartSymbol = symbol;
      const chartRes = await axios.get(
        `http://localhost:5000/api/finnhub/stock/${chartSymbol}/historyUnlimited`
      );
      console.log("Chart response:", chartRes.data);

      const formattedChart = chartRes.data.map((entry) => ({
        date: entry.date,
        price: entry.price,
      }));

      return { price, chart: formattedChart };
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  };

  const handleCryptoLookup = async (symbol) => {
    try {
      symbol = `${symbol}-USD`;
      const { price, chart } = await fetchAssetData(symbol);
      setCryptoPrice(price);
      setCryptoChartData(chart);
      setCryptoError(null);
    } catch {
        setCryptoError("Failed to load crypto data");
        setCryptoPrice(null);
        setCryptoChartData([]);
    }
  };
  const handleLookup = async (symbol) => {
    try {
      const { price, chart } = await fetchAssetData(symbol);
      setStockPrice(price);
      setStockChartData(chart);
      setStockError(null);
    } catch {
      setStockError("Failed to load stock data");
      setStockPrice(null);
      setStockChartData([]);
    }
  };

  return (
    <div className="container">
      {/* === Stock Lookup === */}
      <Card className="p-3 mb-4">
        <h5>Stock Price Lookup</h5>
        <input
          type="text"
          placeholder="e.g. AAPL"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
          className="form-control mb-2"
        />
        <button
          className="btn btn-primary"
          onClick={() => handleLookup(stockSymbol)}
        >
          Get Stock Price & Chart
        </button>
        {stockError && <p className="text-danger mt-2">{stockError}</p>}
        {stockPrice !== null && (
          <p className="mt-2">
            Current Price for {stockSymbol.toUpperCase()}: ${stockPrice}
          </p>
        )}
        {stockChartData.length > 0 && (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[
                  (dataMin) => Math.max(0, dataMin * 0.997),
                  (dataMax) => dataMax * 1.003,
                ]}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#0984e3"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* === Crypto Lookup === */}
      <Card className="p-3 mb-4">
        <h5>Crypto Price Lookup</h5>
        <input
          type="text"
          placeholder="e.g. BTC"
          value={cryptoSymbol}
          onChange={(e) => setCryptoSymbol(e.target.value.toUpperCase())}
          className="form-control mb-2"
        />
        <button
          className="btn btn-success"
          onClick={() => handleCryptoLookup(cryptoSymbol)}
        >
          Get Crypto Price & Chart
        </button>
        {cryptoError && <p className="text-danger mt-2">{cryptoError}</p>}
        {cryptoPrice !== null && (
          <p className="mt-2">
            Current Price for {cryptoSymbol.toUpperCase()}: ${cryptoPrice}
          </p>
        )}
        {cryptoChartData.length > 0 && (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cryptoChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[
                  (dataMin) => Math.max(0, dataMin * 0.997),
                  (dataMax) => dataMax * 1.003,
                ]}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#00cec9"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

export default Portfolio;
