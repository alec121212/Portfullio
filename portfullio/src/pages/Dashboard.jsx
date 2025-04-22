// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Button, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import {LineChart, Line, XAxis, YAxis, Tooltip, 
        ResponsiveContainer, CartesianGrid, 
        PieChart, Pie, Cell, Legend} from "recharts";

const Dashboard = () => {

  const userJohnAssets = [
    { ticker: 'AAPL', name:'Apple', quantity: 20 },
    { ticker: 'BTC', name:'Bitcoin', quantity: 0.25 },
    { ticker: 'VOO', name:'Vanguard S&P 500 ETF', quantity: 10 },
  ];
  
  const [chartData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const COLORS = ['#00cec9', '#fdcb6e', '#d63031', '#6c5ce7'];
  //To toggle
  const [showByType, setShowByType] = useState(true);
  const [pieChartByTicker, setPieChartByTicker] = useState([]);
  const activePieData = showByType ? pieChartData : pieChartByTicker;


  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stock/AAPL/history`);
        console.log("Chart API response:", res.data);
  
        const formatted = res.data.map((entry) => ({
          date: entry.date,
          price: entry.price,
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
        const pricePerUnit = Number(response.data.c);
        newPrices[asset.ticker] = pricePerUnit;
      
        const totalValue = pricePerUnit * asset.quantity;
      
        if (isCryptoAsset) {
          cryptoTotal += totalValue;
        } else {
          stockTotal += totalValue;
        }
      }
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
    };
    fetchChartData();
  }, []);

  return (
    <div className="container">
   <h2 className="page-header">Dashboard Overview</h2>

      {/* Quick Stats */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-primary">Total Crypto</Card.Title>
              <Card.Text className="fs-4 fw-bold">$12,340</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-warning">Stocks</Card.Title>
              <Card.Text className="fs-4 fw-bold">$7,890</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-info">Savings</Card.Title>
              <Card.Text className="fs-4 fw-bold">$3,450</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-danger">Other Assets</Card.Title>
              <Card.Text className="fs-4 fw-bold">$980</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-4">
        <Col md={7}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Portfolio Growth</Card.Title>
              <div style={{ width: "100%", height: "300px" }}>               
                {chartData.length === 0 ? (
                  <p className="text-center mt-5 text-muted">Loading or no data...</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={["auto", "auto"]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke="#00b894" strokeWidth={2} dot={false} />
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
    </div>
  );
};

export default Dashboard;
