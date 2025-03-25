// src/pages/Analytics.jsx
import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const Analytics = () => {
  return (
    <div className="container">
      <h2 className="fw-bold mb-4 text-warning">Analytics</h2>
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Performance Over Time</Card.Title>
              <div style={{ height: "200px", background: "#eef" }}>
                <p className="text-center pt-5 text-muted">[Area Chart Placeholder]</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Risk Allocation</Card.Title>
              <div style={{ height: "200px", background: "#ffe" }}>
                <p className="text-center pt-5 text-muted">[Doughnut Chart Placeholder]</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* You can add more advanced stats, historical data, etc. */}
    </div>
  );
};

export default Analytics;
