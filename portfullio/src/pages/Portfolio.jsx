import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, InputGroup, Button, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const API_BASE = "http://localhost:5000";
const MAX_RECENT = 5;

const Portfolio = () => {
  // Stock state
  const [stockSymbol, setStockSymbol] = useState("");
  const [stockQuote, setStockQuote] = useState(null);
  const [stockChartData, setStockChartData] = useState([]);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  // Crypto state
  const [cryptoSymbol, setCryptoSymbol] = useState("");
  const [cryptoQuote, setCryptoQuote] = useState(null);
  const [cryptoChartData, setCryptoChartData] = useState([]);
  const [isLoadingCrypto, setIsLoadingCrypto] = useState(false);

  const [error, setError] = useState(null);

  const [recentStocks, setRecentStocks] = useState([]);
  const [recentCryptos, setRecentCryptos] = useState([]);

  // Load recent queries from localStorage
  useEffect(() => {
    setRecentStocks(JSON.parse(localStorage.getItem("recentStocks") || "[]"));
    setRecentCryptos(JSON.parse(localStorage.getItem("recentCryptos") || "[]"));
  }, []);

  // Save to recent list helper
  const addToRecent = (symbol, key, setter) => {
    let list = JSON.parse(localStorage.getItem(key) || "[]");
    list = [symbol, ...list.filter(s => s !== symbol)].slice(0, MAX_RECENT);
    localStorage.setItem(key, JSON.stringify(list));
    setter(list);
  };

  // Validation
  const isValidSymbol = sym => /^[A-Z0-9]+$/.test(sym);

  // Fetch stock
  const fetchStock = async () => {
    if (!isValidSymbol(stockSymbol)) { setError("Invalid stock symbol."); return; }
    setError(null); setIsLoadingStock(true);
    try {
      const { data: quote } = await axios.get(`${API_BASE}/api/finnhub/asset/${stockSymbol}`);
      setStockQuote(quote);
      addToRecent(stockSymbol, "recentStocks", setRecentStocks);
      const { data: history } = await axios.get(`${API_BASE}/api/finnhub/stock/${stockSymbol}/history`);
      setStockChartData(history);
      if (!history.length) setError(`No historical data for ${stockSymbol}.`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load stock data.");
    } finally { setIsLoadingStock(false); }
  };

  // Fetch crypto
  const fetchCrypto = async () => {
    if (!isValidSymbol(cryptoSymbol)) { setError("Invalid crypto symbol."); return; }
    setError(null); setIsLoadingCrypto(true);
    try {
      const pair = `BINANCE:${cryptoSymbol}USDT`;
      const { data: quote } = await axios.get(`${API_BASE}/api/finnhub/asset/${pair}`);
      setCryptoQuote(quote);
      addToRecent(cryptoSymbol, "recentCryptos", setRecentCryptos);
      const histSym = `${cryptoSymbol}-USD`;
      const { data: history } = await axios.get(`${API_BASE}/api/finnhub/stock/${histSym}/history`);
      setCryptoChartData(history);
      if (!history.length) setError(`No historical data for ${cryptoSymbol}.`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load crypto data.");
    } finally { setIsLoadingCrypto(false); }
  };

  // Chart renderer
  const renderChart = (data, color) => (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={["auto","auto"]} />
        <Tooltip formatter={val => `$${val.toFixed(2)}`} />
        <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );

  // Render price + % change
  const renderQuote = quote => {
    const pct = quote.pc ? ((quote.c - quote.pc)/quote.pc)*100 : 0;
    const cls = pct>0?'text-success':pct<0?'text-danger':'text-muted';
    return (
      <h5>
        ${quote.c.toFixed(2)}{' '}
        <small className={cls}>{pct>0?'+':''}{pct.toFixed(2)}%</small>
      </h5>
    );
  };

  return (
    <Container className="my-4">
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <Button variant="link" onClick={() => { stockQuote?fetchStock():fetchCrypto(); }}>Retry</Button>
        </div>
      )}
      <Row className="g-4">
        {/* Stock Card */}
        <Col xs={12} md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Stock Price Lookup</Card.Title>
              <InputGroup className="mb-2">
                {recentStocks.map(sym => (
                  <Badge key={sym} bg="secondary" className="me-1" onClick={()=>setStockSymbol(sym)} style={{cursor:'pointer'}}>{sym}</Badge>
                ))}
              </InputGroup>
              <Form.Group controlId="stockSymbol">
                <InputGroup>
                  <Form.Control
                    placeholder="e.g. AAPL"
                    value={stockSymbol}
                    onChange={e=>setStockSymbol(e.target.value.toUpperCase())}
                  />
                  <Button variant="primary" disabled={!isValidSymbol(stockSymbol)||isLoadingStock} onClick={fetchStock}>
                    {isLoadingStock?<Spinner size="sm" animation="border"/>:'Get Stock'}
                  </Button>
                </InputGroup>
              </Form.Group>
              {isLoadingStock && !stockQuote && <div className="bg-light" style={{height:200, marginTop:16}} />}
              {stockQuote && (
                <div className="mt-3">
                  {renderQuote(stockQuote)}
                  {stockChartData.length?renderChart(stockChartData,'#007bff'):<p className="text-muted">No data available.</p>}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        {/* Crypto Card */}
        <Col xs={12} md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Crypto Price Lookup</Card.Title>
              <InputGroup className="mb-2">
                {recentCryptos.map(sym => (
                  <Badge key={sym} bg="secondary" className="me-1" onClick={()=>setCryptoSymbol(sym)} style={{cursor:'pointer'}}>{sym}</Badge>
                ))}
              </InputGroup>
              <Form.Group controlId="cryptoSymbol">
                <InputGroup>
                  <Form.Control
                    placeholder="e.g. BTC"
                    value={cryptoSymbol}
                    onChange={e=>setCryptoSymbol(e.target.value.toUpperCase())}
                  />
                  <Button variant="success" disabled={!isValidSymbol(cryptoSymbol)||isLoadingCrypto} onClick={fetchCrypto}>
                    {isLoadingCrypto?<Spinner size="sm" animation="border"/>:'Get Crypto'}
                  </Button>
                </InputGroup>
              </Form.Group>
              {isLoadingCrypto && !cryptoQuote && <div className="bg-light" style={{height:200, marginTop:16}} />}
              {cryptoQuote && (
                <div className="mt-3">
                  {renderQuote(cryptoQuote)}
                  {cryptoChartData.length?renderChart(cryptoChartData,'#28a745'):<p className="text-muted">No data available.</p>}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Portfolio;
