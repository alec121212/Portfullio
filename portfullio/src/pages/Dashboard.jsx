// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Button, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import {LineChart, Line, XAxis, YAxis, Tooltip, 
        ResponsiveContainer, CartesianGrid, } from "recharts";

const Dashboard = () => {

  const userJohnAssets = [
    { ticker: 'AAPL', name:'Apple', quantity: 20 },
    { ticker: 'BTC', name:'Bitcoin', quantity: 0.75 },
    { ticker: 'VOO', name:'Vanguard S&P 500 ETF', quantity: 10 },
  ];
  
  const [chartData, setChartData] = useState([]);

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
        <Col md={8}>
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
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Positions</Card.Title>
              <div style={{ height: "250px", background: "#ffe", borderRadius: "8px" }}>
                <p className="text-center pt-5 text-muted">[Pie Chart Placeholder]</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
