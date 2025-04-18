const axios = require('axios');

const getAssetQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`Fetching quote for: ${symbol}`);

    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_KEY}`,
      { timeout: 5000 }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch asset data' });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v7/finance/chart/${symbol}?interval=5m&range=1d`
    );

    const timestamps = response.data.chart.result[0].timestamp;
    const prices = response.data.chart.result[0].indicators.quote[0].close;

    let lastValidPrice = null;

    const formattedData = timestamps.map((timestamp, i) => {
      let price = prices[i];

      if (price === null || price === 0) {
        price = lastValidPrice;
      } else if (lastValidPrice !== null) {
        const percentChange = Math.abs((price - lastValidPrice) / lastValidPrice) * 100;
        if (percentChange > 99.5) {
          price = lastValidPrice;
        } else {
          lastValidPrice = price;
        }
      } else {
        lastValidPrice = price;
      }

      return {
        date: new Date(timestamp * 1000).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        price,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Stock history fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
};

module.exports = {
  getAssetQuote,
  getStockHistory,
};
