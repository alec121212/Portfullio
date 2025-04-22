import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Spinner
} from "react-bootstrap";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { getEthBalance } from "../util/etherscan.jsx";
import { getNFTs } from "../util/opensea.jsx";

const Dashboard = () => {
  const [walletExists, setWalletExists] = useState(false);
  const [address, setAddress] = useState("");
  const [plaidExists, setPlaidExists] = useState(false);
  const [linkToken, setLinkToken] = useState(null);

  const [investments, setInvestments] = useState([]);
  const [ethBalance, setEthBalance] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
  });

  // 1) check wallet & Plaid status
  useEffect(() => {
    (async () => {
      try {
        const w = await axios.get("http://localhost:5000/api/crypto/wallet", authHeader());
        if (w.data.exists) {
          setWalletExists(true);
          setAddress(w.data.address);
        }
      } catch (e) {
        console.error("Wallet check error:", e);
      }
      try {
        const p = await axios.get("http://localhost:5000/api/plaid/status", authHeader());
        if (p.data.exists) setPlaidExists(true);
      } catch (e) {
        console.error("Plaid status error:", e);
      }
    })();
  }, []);

  // 2) fetch Plaid Link token
  useEffect(() => {
    if (plaidExists) return;
    (async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/plaid/create_link_token",
          {},
          authHeader()
        );
        setLinkToken(res.data.link_token);
      } catch (e) {
        console.error("Link token error:", e);
      }
    })();
  }, [plaidExists]);

  // Plaid Link hook
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      try {
        await axios.post(
          "http://localhost:5000/api/plaid/exchange_public_token",
          { public_token },
          authHeader()
        );
        setPlaidExists(true);
      } catch (e) {
        console.error("Plaid exchange error:", e);
      }
    }
  });

  // save crypto wallet
  const handleSaveWallet = async () => {
    try {
      await axios.post("http://localhost:5000/api/crypto/wallet", { address }, authHeader());
      setWalletExists(true);
    } catch (e) {
      console.error("Save wallet error:", e);
    }
  };

  // 3) once both exist, fetch investments, ETH balance & NFTs
  useEffect(() => {
    if (!(walletExists && plaidExists)) return;
    (async () => {
      setLoadingData(true);

      // Plaid investments
      try {
        const res = await axios.post(
          "http://localhost:5000/api/plaid/investments",
          {},
          authHeader()
        );
        setInvestments(res.data.holdings);
      } catch (e) {
        console.error("Investments fetch error:", e);
      }

      // ETH balance
      try {
        const bal = await getEthBalance(address);
        setEthBalance(bal);
      } catch (e) {
        console.error("ETH balance error:", e);
      }

      // NFTs
      try {
        const myNFTs = await getNFTs(address);
        setNfts(myNFTs);
      } catch (e) {
        console.error("NFTs fetch error:", e);
      }

      setLoadingData(false);
    })();
  }, [walletExists, plaidExists, address]);

  return (
    <div className="container my-4">
      <h2 className="page-header">Dashboard Overview</h2>

      {/* integration panel */}
      <Card className="mb-4 p-3 shadow-sm">
        <h5>Connect Your Accounts</h5>

        {!walletExists ? (
          <div className="d-flex mb-3">
            <Form.Control
              placeholder="Crypto wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
            />
            <Button
              className="ms-2"
              onClick={handleSaveWallet}
              disabled={!address}
            >
              Save Wallet
            </Button>
          </div>
        ) : (
          <p className="text-success">✅ Wallet connected: {address}</p>
        )}

        <hr />

        {!plaidExists ? (
          <Button disabled={!ready || !walletExists} onClick={open}>
            {ready ? "Connect Brokerage via Plaid" : "Loading Plaid…"}
          </Button>
        ) : (
          <p className="text-success">✅ Plaid connected</p>
        )}
      </Card>
        
      {/*DISPLAYING DATA ONCE CONNECTED*/}
      {walletExists && plaidExists ? (
        loadingData ? (
          <Spinner animation="border" />
        ) : (
          <>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Stocks and Securities</Card.Title>
                {/*THIS COMMENTED LINE BELOW:
                Allows you to view all of the data returned by the Plaid API in Json Format.
                If needed, uncomment this line to view the format and parsing return structure of the data*/}
                {/*<pre>{JSON.stringify(investments, null, 2)}</pre>*/}
                {
                <ul className="mt-4 list-unstyled">
                  {investments.length > 0 ? (
                    investments.map((item, idx) => (
                      <li key={item.security?.security_id ?? idx} className="border p-3 rounded shadow-sm mb-3">
                        <p><strong>Name:</strong> {item.security?.name || 'N/A'}</p>
                        <p><strong>Ticker:</strong> {item.security?.ticker_symbol || 'N/A'}</p>
                        <p><strong>Type:</strong> {item.security?.type || 'N/A'}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p>
                          <strong>Current Price:</strong>{' '}
                          {item.security?.close_price != null
                            ? `$${item.security.close_price.toFixed(2)}`
                            : 'N/A'}
                        </p>
                        <p>
                          <strong>Total Value:</strong>{' '}
                          {item.institution_value != null
                            ? `$${item.institution_value.toFixed(2)}`
                            : 'N/A'}
                        </p>
                      </li>
                    ))
                  ) : (
                    <p className="text-muted">No investment data found.</p>
                  )}
                </ul>
                }
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Ethereum Balance</Card.Title>
                <p>{ethBalance} ETH</p>
              </Card.Body>
            </Card>
            
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Your NFTs</Card.Title>
                  <h6 className="mt-3">NFT Collection:</h6>
                  <div className="d-flex flex-wrap">
                    {nfts.length > 0 ? (
                      nfts.map((nft, index) => (
                        <Card
                          key={index}
                          className="m-2 shadow-sm"
                          style={{ width: "12rem" }}
                        >
                          {nft.image_url && (
                            <Card.Img
                              variant="top"
                              src={nft.image_url}
                              alt={nft.name || "NFT image"}
                              style={{ height: "12rem", objectFit: "cover" }}
                            />
                          )}
                        <Card.Body>
                          <Card.Text className="text-truncate mb-0">
                            {nft.name}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                      ))
                    ) : (
                      <p className="text-muted">No NFTs found.</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
          </>
        )
      ) : (
        <p className="text-center text-muted">
          Please connect your wallet and brokerage above to view your investments!.
        </p>
      )}
    </div>
  );
};

export default Dashboard;