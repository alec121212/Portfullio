import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  Form,
  Spinner
} from "react-bootstrap";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { usePlaidLink } from "react-plaid-link";

const Dashboard = () => {
  const [walletExists, setWalletExists] = useState(false);
  const [address, setAddress] = useState("");
  const [plaidExists, setPlaidExists] = useState(false);
  const [linkToken, setLinkToken] = useState(null);

  //these don't work for now
  const [chartData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [pieChartByTicker, setPieChartByTicker] = useState([]);
  const [showByType, setShowByType] = useState(true);
  const [loadingHoldings, setLoadingHoldings] = useState(false);

  const activePieData = showByType ? pieChartData : pieChartByTicker;
  const COLORS = ['#00cec9', '#fdcb6e', '#d63031', '#6c5ce7'];

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
  });

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

  const { open, ready: plaidReady } = usePlaidLink({
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

  const handleSaveWallet = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/crypto/wallet",
        { address },
        authHeader()
      );
      setWalletExists(true);
    } catch (e) {
      console.error("Save wallet error:", e);
    }
  };

  //doesn't work for now
  useEffect(() => {
    if (!(walletExists && plaidExists)) return;

    const fetchChartData = async () => {
      const userJohnAssets = [
        { ticker: 'AAPL', name:'Apple', quantity: 20 },
        { ticker: 'BTC', name:'Bitcoin', quantity: 0.25 },
        { ticker: 'VOO', name:'Vanguard S&P 500 ETF', quantity: 10 },
      ];

      try {
        const res = await axios.get(
          "http://localhost:5000/api/stock/AAPL/history"
        );
        const formatted = res.data.map((entry) => ({
          date: entry.date,
          price: entry.price
        }));
        setChartData(formatted);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }

      const newPrices = {};
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
      }

      setPieChartData([
        { name: 'Crypto', value: cryptoTotal },
        { name: 'Stocks', value: stockTotal }
      ]);

      setPieChartByTicker(
        userJohnAssets.map((asset) => ({
          name: asset.ticker,
          value: (newPrices[asset.ticker]||0) * asset.quantity
        }))
      );
    };

    setLoadingHoldings(true);
    fetchChartData().finally(() => setLoadingHoldings(false));
  }, [walletExists, plaidExists]);

  return (
    <div className="container my-4">
      <h2 className="page-header">Dashboard Overview</h2>

      <Card className="mb-4 p-3 shadow-sm">
        <h5>Connect Your Accounts</h5>

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

        {/* Plaid Link */}
        {!plaidExists ? (
          <Button
            disabled={!plaidReady || !walletExists}
            onClick={() => open()}
          >
            {plaidReady ? "Connect Brokerage via Plaid" : "Loading Plaid…"}
          </Button>
        ) : (
          <p className="text-success">✅ Plaid connected</p>
        )}
      </Card>

      {/* None of this will work for now, we need to access the return data from calling crypto APIs and and getInvestments from
      plaidController. Next steps*/}
      {walletExists && plaidExists ? (
        <>
          <Row className="mb-4 g-3">
          </Row>

          <Row className="g-4">
            <Col md={7}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>Portfolio Growth</Card.Title>
                  <div style={{ width: "100%", height: "300px" }}>
                    {!chartData.length ? (
                      <p className="text-center mt-5 text-muted">
                        Loading or no data…
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={["auto","auto"]} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="price"
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

            <Col md={5}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title className="mb-0">Positions</Card.Title>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setShowByType((p) => !p)}
                      style={{ fontSize: "0.75rem", padding: "2px 8px" }}
                    >
                      {showByType ? "View by Ticker" : "View by Type"}
                    </Button>
                  </div>
                  <div
                    style={{
                      height: "300px",
                      background: "#ffe",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {loadingHoldings ? (
                      <Spinner animation="border" />
                    ) : activePieData.every((it) => it.value === 0) ? (
                      <p className="text-center text-muted">
                        Loading pie chart…
                      </p>
                    ) : (
                      <PieChart width={325} height={200}>
                        <Pie
                          data={activePieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          dataKey="value"
                        >
                          {activePieData.map((_, idx) => (
                            <Cell
                              key={idx}
                              fill={COLORS[idx % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            `$${value.toLocaleString()}`,
                            name
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <p className="text-center text-muted">
          Please connect your wallet and brokerage above to view your dashboard.
        </p>
      )}
    </div>
  );
};

export default Dashboard;