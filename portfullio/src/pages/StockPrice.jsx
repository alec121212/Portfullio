import { useState } from "react";
import axios from "axios";

function StockPrice() {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  const fetchPrice = async () => {
    console.log("Fetching price for:", symbol); // Log when the fetch is triggered

    try {
      const response = await axios.get(`http://localhost:5000/api/stock/${symbol}`);
      console.log(response.data); // Log the response data for debugging
      setPrice(response.data.c); // 'c' is the current price in Finnhub response
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching stock price:", error); // Log the error for debugging
      setError("Error fetching stock price");
      setPrice(null);
    }
  };

  return (
    <div>
      <h2>Stock Price</h2>
      <input
        type="text"
        placeholder="Enter Stock Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())} // Converts input to uppercase
      />
      <button onClick={fetchPrice}>Get Stock Price</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {price !== null ? (
        <p>Price for {symbol}: ${price}</p>
      ) : (
        <p>Enter a stock symbol and click "Get Stock Price" to see the price.</p>
      )}
    </div>
  );
}

export default StockPrice;
