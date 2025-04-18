const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

const PLAID_CLIENT_ID=process.env.PLAID_CLIENT_ID
const PLAID_SECRET=process.env.PLAID_SECRET
const PLAID_ENV=process.env.PLAID_ENV

const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(configuration)
export default plaidClient;