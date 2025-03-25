export async function createLinkToken() {
    const res = await fetch('http://localhost:5000/api/plaid/create_link_token', {
      method: 'POST',
    });
    const data = await res.json();
    return data.link_token;
}

export async function exchangePublicToken(publicToken) {
    const res = await fetch('http://localhost:5000/api/plaid/exchange_public_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token: publicToken }),
    });
    const data = await res.json();
    return data.accessToken;
}

export async function getInvestments(accessToken) {
    const res = await fetch('http://localhost:5000/api/plaid/investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken }),
    });
    return res.json();
}
  