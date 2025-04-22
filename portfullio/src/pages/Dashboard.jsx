import React, { useEffect, useState } from "react";
import { Button, Card, Form, Spinner, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { getEthBalance } from "../util/etherscan.jsx";
import { getNFTs } from "../util/opensea.jsx";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const API_BASE = "http://localhost:5000";

const Dashboard = () => {
  // State hooks
  const [walletExists, setWalletExists] = useState(false);
  const [address, setAddress] = useState("");
  const [plaidExists, setPlaidExists] = useState(false);
  const [linkToken, setLinkToken] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [ethBalance, setEthBalance] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [price, setPrice] = useState({});
  const [percentChange, setPercentChange] = useState({});
  const [chartData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [pieChartByTicker, setPieChartByTicker] = useState([]);
  const [showByType, setShowByType] = useState(true);
  const [error, setError] = useState(null);

  // Sample assets
  const userJohnAssets = [
    { ticker: 'AAPL', name: 'Apple', quantity: 20 },
    { ticker: 'BTC', name: 'Bitcoin', quantity: 0.25 },
    { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', quantity: 10 }
  ];

  const COLORS = ['#00cec9', '#fdcb6e', '#d63031', '#6c5ce7'];
  const activePieData = showByType ? pieChartData : pieChartByTicker;

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
  });

  const delay = ms => new Promise(res => setTimeout(res, ms));

  const getChangeClass = change => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-danger';
    return 'text-muted';
  };

  // 1) Check wallet & Plaid status
  useEffect(() => {
    (async () => {
      try {
        const { data: w } = await axios.get(`${API_BASE}/api/crypto/wallet`, authHeader());
        if (w.exists) {
          setWalletExists(true);
          setAddress(w.address);
        }
      } catch (e) {
        console.error("Wallet check error:", e);
      }
      try {
        const { data: p } = await axios.get(`${API_BASE}/api/plaid/status`, authHeader());
        if (p.exists) setPlaidExists(true);
      } catch (e) {
        console.error("Plaid status error:", e);
      }
    })();
  }, []);

  // 2) Fetch Plaid link token
  useEffect(() => {
    if (plaidExists) return;
    (async () => {
      try {
        const { data: res } = await axios.post(
          `${API_BASE}/api/plaid/create_link_token`,
          {},
          authHeader()
        );
        setLinkToken(res.link_token);
      } catch (e) {
        console.error("Link token error:", e);
      }
    })();
  }, [plaidExists]);

  // Plaid Link hook
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async public_token => {
      try {
        await axios.post(
          `${API_BASE}/api/plaid/exchange_public_token`,
          { public_token },
          authHeader()
        );
        setPlaidExists(true);
      } catch (e) {
        console.error("Plaid exchange error:", e);
      }
    }
  });

  // Save crypto wallet
  const handleSaveWallet = async () => {
    try {
      await axios.post(
        `${API_BASE}/api/crypto/wallet`,
        { address },
        authHeader()
      );
      setWalletExists(true);
    } catch (e) {
      console.error("Save wallet error:", e);
    }
  };

  // 3) Fetch data once when ready
  useEffect(() => {
    if (!(walletExists && plaidExists)) return;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Fetch investments
        const { data: inv } = await axios.post(
          `${API_BASE}/api/plaid/investments`,
          {},
          authHeader()
        );
        setInvestments(inv.holdings || []);

        // Fetch prices & build portfolio data
        let cryptoTotal = 0;
        let stockTotal = 0;
        const dates = new Set();
        const portfolioData = {};
        const newPrices = {};
        const newPct = {};

        for (const asset of userJohnAssets) {
          let symbol = asset.ticker;
          const isCrypto = ['BTC','ETH','DOGE','SOL','ADA','XRP','BNB'].includes(symbol);
          if (isCrypto) symbol = `BINANCE:${symbol}USDT`;

          const { data: quote } = await axios.get(
            `${API_BASE}/api/finnhub/asset/${symbol}`
          );
          const priceUnit = Number(quote.c);
          newPrices[asset.ticker] = priceUnit;
          const assetValue = priceUnit * asset.quantity;
          if (isCrypto) cryptoTotal += assetValue;
          else stockTotal += assetValue;

          const { data: history } = await axios.get(
            `${API_BASE}/api/finnhub/stock/${
              isCrypto ? `${asset.ticker}-USD` : asset.ticker
            }/history`
          );
          history.forEach(entry => {
            dates.add(entry.date);
            portfolioData[entry.date] =
              (portfolioData[entry.date] || 0) + entry.price * asset.quantity;
          });

          await delay(500);
        }

        // Fetch ETH balance & NFTs
        setEthBalance(await getEthBalance(address));
        setNfts(await getNFTs(address));

        setPrice(newPrices);
        setPercentChange(newPct);

        setPieChartData([
          { name: 'Crypto', value: cryptoTotal },
          { name: 'Stocks', value: stockTotal }
        ]);
        setPieChartByTicker(
          userJohnAssets.map(a => ({
            name: a.ticker,
            value: (newPrices[a.ticker] || 0) * a.quantity
          }))
        );

        setChartData(
          Array.from(dates)
            .sort((a, b) => new Date(a) - new Date(b))
            .map(date => ({ date, totalValue: Number(portfolioData[date].toFixed(2)) }))
        );

        setError(null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [walletExists, plaidExists, address]);

  return (
    <div className="container">
      <h2 className="fw-bold mb-4 text-primary">Portfolio Dashboard</h2>
      <div className="container my-4">
        <h2 className="page-header">Dashboard Overview</h2>

        {/* Connect panel */}
        <Card className="mb-4 p-3 shadow-sm">
          <h5>Connect Your Accounts</h5>
          {!walletExists ? (
            <div className="d-flex mb-3">
              <Form.Control
                placeholder="Crypto wallet address"
                value={address}
                onChange={e => setAddress(e.target.value.trim())}
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

        {/* Main content */}
        {walletExists && plaidExists ? (
          loadingData ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <>
              {/* Investments table */}
              <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                  <Card.Title>Stocks and Securities</Card.Title>
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
                      {investments.length > 0 ? (
                        investments.map((item, idx) => (
                          <tr key={item.security?.security_id || idx}>
                            <td>{item.security?.name || 'N/A'} ({item.security?.ticker_symbol || 'N/A'})</td>
                            <td>{item.security?.type || 'N/A'}</td>
                            <td>{item.quantity}</td>
                            <td>{item.security?.close_price != null ? `$${item.security.close_price.toFixed(2)}` : 'N/A'}</td>
                            <td className={getChangeClass(((item.security?.close_price - item.security?.open_price) / item.security?.open_price) * 100)}>
                              {item.security?.close_price && item.security?.open_price ? `${(((item.security.close_price - item.security.open_price) / item.security.open_price) * 100).toFixed(2)}%` : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={5} className="text-muted text-center">No investment data found.</td></tr>
                      )}
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
                      <div style={{ width: '100%', height: '300px' }}>
                        {chartData.length === 0 ? (
                          <p className="text-center text-muted mt-5">Loading or no data...</p>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={[dataMin => Math.max(0, dataMin * 0.997), dataMax => dataMax * 1.003]} />
                              <ChartTooltip />
                              <Line type="monotone" dataKey="totalValue" stroke="#00b894" dot={false} strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={5}>
                  <Card className="shadow-sm border-0">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Card.Title className="mb-0">Positions</Card.Title>
                        <Button variant="outline-secondary" size="sm" onClick={() => setShowByType(prev => !prev)} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                          {showByType ? 'View by Ticker' : 'View by Type'}
                        </Button>
                      </div>
                      <div style={{ height: '300px', background: '#ffe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {activePieData.every(item => item.value === 0) ? (
                          <p className="text-center text-muted">Loading pie chart...</p>
                        ) : (
                          <PieChart width={325} height={200}>
                            <Pie data={activePieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                              {activePieData.map((entry, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                            </Pie>
                            <ChartTooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                            <Legend />
                          </PieChart>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Ethereum Balance */}
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Ethereum Balance</Card.Title>
                  <p>{ethBalance} ETH</p>
                </Card.Body>
              </Card>

              {/* NFTs */}
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Your NFTs</Card.Title>
                  <h6 className="mt-3">NFT Collection:</h6>
                  <div className="d-flex flex-wrap">
                    {nfts.length > 0 ? (
                      nfts.map((nft, idx) => (
                        <Card key={idx} className="m-2 shadow-sm" style={{ width: '12rem' }}>
                          {nft.image_url && <Card.Img variant="top" src={nft.image_url} style={{ height: '12rem', objectFit: 'cover' }} />}
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
          <p className="text-center text-muted">Please connect your wallet and brokerage above to view your investments!.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
