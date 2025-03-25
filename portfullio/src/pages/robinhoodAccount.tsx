import React from "react";
import { useState, useEffect } from "react";

function RobinhoodAccount() {
  const [account, setAccount] = useState(null);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    // Fetch account info
    fetch("http://localhost:5000/api/robinhood/account")
      .then(res => res.json())
      .then(data => setAccount(data))
      .catch(err => console.error("Error fetching account:", err));

    // Fetch portfolio info
    fetch("http://localhost:5000/api/robinhood/portfolio")
      .then(res => res.json())
      .then(data => setPortfolio(data))
      .catch(err => console.error("Error fetching portfolio:", err));
  }, []);

  return (
    <div>
      <h2>Robinhood Account Info</h2>
      {account ? <pre>{JSON.stringify(account, null, 2)}</pre> : <p>Loading...</p>}

      <h2>Portfolio</h2>
      {portfolio ? <pre>{JSON.stringify(portfolio, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}

export default RobinhoodAccount;
