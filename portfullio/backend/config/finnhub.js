const { ApiClient, DefaultApi } = require('finnhub');
require('dotenv').config();

const apiClient = ApiClient.instance;
apiClient.authentications['api_key'].apiKey = process.env.FINNHUB_KEY;

const finnhubClient = new DefaultApi();

module.exports = finnhubClient;
