import { ApiClient, DefaultApi } from 'finnhub';
import dotenv from 'dotenv';

dotenv.config();

const apiClient = ApiClient.instance;
apiClient.authentications['api_key'].apiKey = process.env.FINNHUB_KEY;

const finnhubClient = new DefaultApi();

module.exports = finnhubClient;
