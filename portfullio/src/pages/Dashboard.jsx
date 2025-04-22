import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Spinner
} from "react-bootstrap";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { getEthBalance } from "../util/etherscan.jsx";
import { getNFTs } from "../util/opensea.jsx";

const Dashboard = () => {
  const [walletExists, setWalletExists] = useState(false);
  const [address, setAddress] = useState("");
  const [plaidExists, setPlaidExists] = useState(false);
  const [linkToken, setLinkToken] = useState(null);

  const userJohnAssets = [
    { ticker: 'AAPL', name: 'Apple', quantity: 20 },
    { ticker: 'BTC', name: 'Bitcoin', quantity: 0.25 },
    { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', quantity: 10 },
  ];
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState({});
  const [percentChange, setPercentChange] = useState({});
  const [chartData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [pieChartByTicker, setPieChartByTicker] = useState([]);
  const [showByType, setShowByType] = useState(true);
  const [error, setError] = useState(null);
  const COLORS = ['#00cec9', '#fdcb6e', '#d63031', '#6c5ce7'];

  const activePieData = showByType ? pieChartData : pieChartByTicker;

  const getChangeClass = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-danger';
    return 'text-muted';
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
  const [loadingHoldings, setLoadingHoldings] = useState(false);

  const [investments, setInvestments] = useState([]);
  const [ethBalance, setEthBalance] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);


  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
  });

  // 1) check wallet & Plaid status
  useEffect(() => {
    (async () => {
      try {
        const w = await axios.get("http://localhost:5000/api/crypto/wallet", authHeader());
        if (w.data.exists) {
          setWalletExists(true);
          setAddress(w.data.address);
        }
      } catch (e) {
        console.error("Wallet check error:", e);
      }
      try {
        const p = await axios.get("http://localhost:5000/api/plaid/status", authHeader());
        if (p.data.exists) setPlaidExists(true);
      } catch (e) {
        console.error("Plaid status error:", e);
      }
    })();
  }, []);

  // 2) fetch Plaid Link token
  useEffect(() => {
    if (plaidExists) return;
    (async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/plaid/create_link_token",
          {},
          authHeader()
        );
        setLinkToken(res.data.link_token);
      } catch (e) {
        console.error("Link token error:", e);
      }
    })();
  }, [plaidExists]);

  // Plaid Link hook
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      try {
        await axios.post(
          "http://localhost:5000/api/plaid/exchange_public_token",
          { public_token },
          authHeader()
        );
        setPlaidExists(true);
      } catch (e) {
        console.error("Plaid exchange error:", e);
      }
    }
  });

  // save crypto wallet
  const handleSaveWallet = async () => {
    try {
      await axios.post("http://localhost:5000/api/crypto/wallet", { address }, authHeader());
      setWalletExists(true);
    } catch (e) {
      console.error("Save wallet error:", e);
    }
  };

  // 3) once both exist, fetch investments, ETH balance & NFTs
  useEffect(() => {
    if (!(walletExists && plaidExists)) return;
    (async () => {
      setLoadingData(true);

      // Plaid investments
      try {
        const res = await axios.post(
          "http://localhost:5000/api/plaid/investments",
          {},
          authHeader()
        );
        setInvestments(res.data.holdings);
      } catch (e) {
        console.error("Investments fetch error:", e);
      }

      const newPrices = {};
      const newPercentChanges = {};
      const portfolioData = {}; // To store total portfolio value by date
      const datesSet = new Set(); // To ensure unique dates

      let cryptoTotal = 0;
      let stockTotal = 0;
      for (const asset of userJohnAssets) {
        let symbol = asset.ticker;
        const isCrypto = ['BTC','ETH','DOGE','SOL','ADA','XRP','BNB']
          .includes(asset.ticker.toUpperCase());

        if (isCrypto) {
          symbol = `BINANCE:${asset.ticker}USDT`;
        }
        try {
          const resp = await axios.get(
            `http://localhost:5000/api/asset/${symbol}`
          );
          const pricePerUnit = Number(resp.data.c);
          const totalValue = pricePerUnit * asset.quantity;
          newPrices[asset.ticker] = pricePerUnit;
          if (isCrypto) cryptoTotal += totalValue;
          else         stockTotal  += totalValue;
        } catch(e) {
          console.error(`Error fetching ${symbol}:`, e);
        }
      // ETH balance
      try {
        const bal = await getEthBalance(address);
        setEthBalance(bal);
      } catch (e) {
        console.error("ETH balance error:", e);
      }

      // NFTs
      try {
        const myNFTs = await getNFTs(address);
        setNfts(myNFTs);
      } catch (e) {
        console.error("NFTs fetch error:", e);
      }

      setLoadingData(false);
    })();
  }, [walletExists, plaidExists, address]);

      try {
        for (const asset of userJohnAssets) {
          let symbol = asset.ticker;
          const isCrypto = (ticker) => {
            const cryptoTickers = ['BTC', 'ETH', 'DOGE', 'SOL', 'ADA', 'XRP', 'BNB'];
            return cryptoTickers.includes(ticker.toUpperCase());
          };

          const isCryptoAsset = isCrypto(asset.ticker);
          if (isCryptoAsset) {
            symbol = `BINANCE:${asset.ticker}USDT`; // For crypto
          }

          // Fetch price data
          const url = `http://localhost:5000/api/asset/${symbol}`;
          const response = await axios.get(url);
          newPrices[asset.ticker] = Number(response.data.c); // Current price

          // Calculate percent change
          const currentPrice = Number(response.data.c);
          const previousClose = Number(response.data.pc);
          const percentChange = previousClose
            ? ((currentPrice - previousClose) / previousClose) * 100
            : 0;
          newPercentChanges[asset.ticker] = percentChange;

          // Calculate total value for the pie chart
          const totalValue = currentPrice * asset.quantity;
          if (isCryptoAsset) {
            cryptoTotal += totalValue;
          } else {
            stockTotal += totalValue;
          }

          // Fetch historical data for the chart
          const chartSymbol = isCryptoAsset ? `${asset.ticker}-USD` : asset.ticker;
          const res = await axios.get(`http://localhost:5000/api/stock/${chartSymbol}/history`);
          const history = res.data;

          history.forEach(entry => {
            const value = entry.price * asset.quantity;
            const date = entry.date;
            if (!datesSet.has(date)) datesSet.add(date);
            if (!portfolioData[date]) portfolioData[date] = 0;
            portfolioData[date] += value; // Accumulate portfolio value
          });

          await delay(750); // Delay for each API call to space out requests
        }

        // Prepare the pie chart data
        const pieDataByType = [
          { name: 'Crypto', value: cryptoTotal },
          { name: 'Stocks', value: stockTotal },
        ];
        setPieChartData(pieDataByType);

        const pieDataByTicker = userJohnAssets.map(asset => {
          const price = newPrices[asset.ticker];
          return {
            name: asset.ticker,
            value: price * asset.quantity,
          };
        });
        setPieChartByTicker(pieDataByTicker);

        // Format the portfolio chart data (total value over time)
        const formattedChartData = Array.from(datesSet)
          .sort((a, b) => new Date(a) - new Date(b)) // Ensure the dates are sorted
          .map(date => ({
            date,
            totalValue: Number(portfolioData[date].toFixed(2)), // Round to 2 decimal places
          }));

        // Set the state with the fetched data
        setChartData(formattedChartData);
        setPrice(newPrices);
        setPercentChange(newPercentChanges);

        // Clear any previous errors
        setError(null);
      } catch (err) {
        console.error('Error fetching prices or data:', err);
        setError('Failed to load asset prices');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="container">
      <h2 className="fw-bold mb-4 text-primary">Portfolio Dashboard</h2>
    <div className="container my-4">
      <h2 className="page-header">Dashboard Overview</h2>

      {/* integration panel */}
      <Card className="mb-4 p-3 shadow-sm">
        <h5>Connect Your Accounts</h5>

      {/* Portfolio Table */}
      <Card className="shadow-sm border-0 mb-4">
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
                    <td>
                      {typeof price[asset.ticker] === 'number'
                        ? `$${(price[asset.ticker] * asset.quantity).toFixed(2)}`
                        : 'Loading...'}
                    </td>
                    <td className={getChangeClass(percentChange[asset.ticker])}>
                      {typeof percentChange[asset.ticker] === 'number'
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

      {/* Portfolio Growth Chart */}
      <Row className="g-4 mb-4">
        <Col md={7}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Portfolio Growth</Card.Title>
              <div style={{ width: "100%", height: "300px" }}>
                {chartData.length === 0 ? (
                  <p className="text-center text-muted mt-5">Loading or no data...</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
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
            </Card.Body>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="mb-0">Positions</Card.Title>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowByType(prev => !prev)}
                  style={{ fontSize: "0.75rem", padding: "2px 8px" }}
                >
                  {showByType ? "View by Ticker" : "View by Type"}
                </Button>
              </div>
              <div style={{ height: "300px", background: "#ffe", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {activePieData.every(item => item.value === 0) ? (
                  <p className="text-center text-muted">Loading pie chart...</p>
                ) : (
                  <PieChart width={325} height={200}>
                    <Pie
                      data={activePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                    />
                    <Legend />
                  </PieChart>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
        {/* Crypto Logic */}

        {!walletExists ? (
          <div className="d-flex mb-3">
            <Form.Control
              placeholder="Crypto wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
            />
            <Button
              className="ms-2"
              onClick={handleSaveWallet}
              disabled={!address}
            >
              Save Wallet
            </Button>
          </div>
        ) : (
          <p className="text-success">✅ Wallet connected: {address}</p>
        )}

        <hr />

        {!plaidExists ? (
          <Button disabled={!ready || !walletExists} onClick={open}>
            {ready ? "Connect Brokerage via Plaid" : "Loading Plaid…"}
          </Button>
        ) : (
          <p className="text-success">✅ Plaid connected</p>
        )}
      </Card>
        
      {/*DISPLAYING DATA ONCE CONNECTED*/}
      {walletExists && plaidExists ? (
        loadingData ? (
          <Spinner animation="border" />
        ) : (
          <>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Stocks and Securities</Card.Title>
                {/*THIS COMMENTED LINE BELOW:
                Allows you to view all of the data returned by the Plaid API in Json Format.
                If needed, uncomment this line to view the format and parsing return structure of the data*/}
                {/*<pre>{JSON.stringify(investments, null, 2)}</pre>*/}
                {
                <ul className="mt-4 list-unstyled">
                  {investments.length > 0 ? (
                    investments.map((item, idx) => (
                      <li key={item.security?.security_id ?? idx} className="border p-3 rounded shadow-sm mb-3">
                        <p><strong>Name:</strong> {item.security?.name || 'N/A'}</p>
                        <p><strong>Ticker:</strong> {item.security?.ticker_symbol || 'N/A'}</p>
                        <p><strong>Type:</strong> {item.security?.type || 'N/A'}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p>
                          <strong>Current Price:</strong>{' '}
                          {item.security?.close_price != null
                            ? `$${item.security.close_price.toFixed(2)}`
                            : 'N/A'}
                        </p>
                        <p>
                          <strong>Total Value:</strong>{' '}
                          {item.institution_value != null
                            ? `$${item.institution_value.toFixed(2)}`
                            : 'N/A'}
                        </p>
                      </li>
                    ))
                  ) : (
                    <p className="text-muted">No investment data found.</p>
                  )}
                </ul>
                }
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Ethereum Balance</Card.Title>
                <p>{ethBalance} ETH</p>
              </Card.Body>
            </Card>
            
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Your NFTs</Card.Title>
                  <h6 className="mt-3">NFT Collection:</h6>
                  <div className="d-flex flex-wrap">
                    {nfts.length > 0 ? (
                      nfts.map((nft, index) => (
                        <Card
                          key={index}
                          className="m-2 shadow-sm"
                          style={{ width: "12rem" }}
                        >
                          {nft.image_url && (
                            <Card.Img
                              variant="top"
                              src={nft.image_url}
                              alt={nft.name || "NFT image"}
                              style={{ height: "12rem", objectFit: "cover" }}
                            />
                          )}
                        <Card.Body>
                          <Card.Text className="text-truncate mb-0">
                            {nft.name}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                      ))
                    ) : (
                      <p className="text-muted">No NFTs found.</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
          </>
        )
      ) : (
        <p className="text-center text-muted">
          Please connect your wallet and brokerage above to view your investments!.
        </p>
      )}
      </div>
    </div>
  );
};

export default Dashboard;