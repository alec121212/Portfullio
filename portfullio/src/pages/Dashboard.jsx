// src/pages/Dashboard.jsx
import React from "react";
import { Button, Row, Col, Card } from "react-bootstrap";

const Dashboard = () => {
  return (
    <div className="container">
      <h2 className="mb-4 fw-bold text-success">Dashboard Overview</h2>

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
              <div style={{ height: "250px", background: "#eef", borderRadius: "8px" }}>
                <p className="text-center pt-5 text-muted">[Line Chart Placeholder]</p>
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
