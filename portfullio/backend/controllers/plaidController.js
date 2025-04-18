import plaidClient from '../config/plaid.js';

export const createLinkToken = async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'test-user-mike-01' }, // Replace w/ real user ID
      client_name: 'Portfullio',
      products: ['investments'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(response.data);
  } catch (error) {
    console.error('Link token creation error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

export const exchangePublicToken = async (req, res) => {
  try {
    const { public_token } = req.body;
    const tokenResponse = await plaidClient.itemPublicTokenExchange({ public_token });
    const accessToken = tokenResponse.data.access_token;
    res.json({ accessToken });
  } catch (error) {
    console.error('Public token exchange error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getInvestments = async (req, res) => {
  try {
    const { accessToken } = req.body;

    const holdingsResponse = await plaidClient.investmentsHoldingsGet({ access_token: accessToken });
    const { holdings, securities } = holdingsResponse.data;

    const enrichedHoldings = holdings.map(holding => {
      const matchingSecurity = securities.find(sec => sec.security_id === holding.security_id);
      return {
        ...holding,
        security: matchingSecurity || null,
      };
    });

    res.json({ holdings: enrichedHoldings });
  } catch (error) {
    console.error('Investments fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};
