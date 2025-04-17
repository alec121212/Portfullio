import express from 'express';
import plaidClient from '../plaidClient.js';

const router = express.Router();

// Create Link Token
router.post('/create_link_token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
        //user id will be updated once integrated with DB
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
});

// Exchange Public Token
router.post('/exchange_public_token', async (req, res) => {
  try {
    const { public_token } = req.body;
    const tokenResponse = await plaidClient.itemPublicTokenExchange({ public_token });
    const accessToken = tokenResponse.data.access_token;
    // Store securely (e.g., DB or session)
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/investments', async (req, res) => {
    try {
      const { accessToken } = req.body;
  
      // Get holdings
      const holdingsResponse = await plaidClient.investmentsHoldingsGet({
        access_token: accessToken,
      });
  
      const { holdings, securities } = holdingsResponse.data;
  
      // Enrich holdings with security metadata
      const enrichedHoldings = holdings.map(holding => {
        const matchingSecurity = securities.find(sec => sec.security_id === holding.security_id);
  
        return {
          ...holding,
          security: matchingSecurity || null,
        };
      });
  
      res.json({ holdings: enrichedHoldings });
    } catch (error) {
      console.error('Error fetching investments:', error.response?.data || error.message);
      res.status(500).json({ error: error.message });
    }
  });
  

export default router;