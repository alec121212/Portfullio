import plaidClient from '../config/plaid.js';
import plaidItem from '../models/plaidItem.js';
import jwt from "jsonwebtoken";

export const createLinkToken = async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'test-user-mike-01' },
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
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
    public_token, });
    const accessToken = tokenResponse.data.access_token;

    await plaidItem.findOneAndUpdate(
      { email: req.userId },
      { accessToken },
      { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    res.json({ saved: true });

  } catch (error) {
    console.error('Public token exchange error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

export const plaidStatus = async (req, res) => {
  const item = await plaidItem.findOne({ email: req.userId });
  res.json({ exists: Boolean(item) });
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
