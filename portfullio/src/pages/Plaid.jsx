import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const PlaidInvestments = () => {

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Investments</h1>
      {!accessToken && linkToken && (
        <button onClick={open} disabled={!ready} className="bg-blue-600 text-white px-4 py-2 rounded">
          Connect Plaid
        </button>
      )}
      {investments.length > 0 && (
        <ul className="mt-6 space-y-3">
          {investments.map((item, idx) => (
            <li key={idx} className="border p-4 rounded shadow">
              <p><strong>Name:</strong> {item.security?.name || 'N/A'}</p>
              <p><strong>Ticker:</strong> {item.security?.ticker_symbol || 'N/A'}</p>
              <p><strong>Type:</strong> {item.security?.type || 'N/A'}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Current Price:</strong> ${item.security?.close_price?.toFixed(2) || 'N/A'}</p>
              <p><strong>Total Value:</strong> ${item.institution_value.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaidInvestments;