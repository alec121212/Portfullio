// src/pages/Portfolio.jsx
import React from "react";
import { Table, Card } from "react-bootstrap";

const Portfolio = () => {
  return (
    <div className="container">
      <h2 className="fw-bold mb-4 text-primary">My Portfolio</h2>
      <Card className="shadow-sm border-0">
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
              <tr>
                <td>Bitcoin (BTC)</td>
                <td>Crypto</td>
                <td>0.5</td>
                <td>$10,000</td>
                <td className="text-success">+2%</td>
              </tr>
              <tr>
                <td>Apple (AAPL)</td>
                <td>Stock</td>
                <td>20</td>
                <td>$3,000</td>
                <td className="text-danger">-1.2%</td>
              </tr>
              <tr>
                <td>Vanguard S&P 500 (VOO)</td>
                <td>ETF</td>
                <td>10</td>
                <td>$3,500</td>
                <td className="text-success">+0.5%</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Portfolio;
