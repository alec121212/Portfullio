import axios from 'axios';

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

    // Format data first
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

      // Convert to Eastern Time
      const dateObj = new Date(timestamp * 1000);
      const etTime = new Date(dateObj.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const hour = etTime.getHours();
      const minute = etTime.getMinutes();
      const totalMinutes = hour * 60 + minute;

      // NYSE filter: 9:30 AM - 4:00 PM (570 to 960)
      if (totalMinutes < 570 || totalMinutes > 960) return null;

      return {
        date: etTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
            minute: '2-digit',
          }),
        price,
      };
    }).filter(Boolean); // remove nulls

    const cleanedData = formattedData
    .filter((entry, i, arr) => {
      if (i === 0) return true;
      const prev = arr[i - 1].price;
      const change = Math.abs((entry.price - prev) / prev) * 100;
      return change < 30;
    })
    .slice(0, -1); // remove the last point

    res.json(cleanedData);
  } catch (error) {
    console.error('Stock history fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
};

export {
  getAssetQuote,
  getStockHistory,
};
