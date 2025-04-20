// src/pages/About.jsx
import React from "react";
import { Card } from "react-bootstrap";

const About = () => {
  return (
    <div className="container">
      <Card className="shadow-sm border-0">
        <Card.Body>
         <h2 className="page-header">About Portfullio</h2>
        <p className="fs-5">
            <strong>Portfullio</strong> is your all-in-one investment tracking platform. We aggregate and
            visualize data from your crypto wallets, traditional brokerage accounts, and more—so you
            can see your entire financial picture in a single dashboard.
          </p>
          <ul>
            <li>Track Crypto, Stocks, ETFs, and more—everything in one place.</li>
            <li>Stay updated on real-time prices and performance metrics.</li>
            <li>Use our analytics to gain deeper insight into your portfolio growth and risk.</li>
            <li>Connect easily via Google sign-in to sync data across devices.</li>
          </ul>
          <p className="text-muted mt-4">
            Portfullio is developed by the <em>University of Florida Senior Project Team.</em> Built with 
            React, Vite, and a passion for simplifying investment management. 
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default About;
