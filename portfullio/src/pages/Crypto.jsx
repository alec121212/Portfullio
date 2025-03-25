// src/pages/Crypto.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEthBalance } from "../util/etherscan.jsx";
import { getNFTs } from "../util/opensea.jsx";
import { Button, Card, Form } from "react-bootstrap";

const Crypto = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [nfts, setNfts] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!address) return;
    const ethBalance = await getEthBalance(address);
    setBalance(ethBalance);

    const fetchedNFTs = await getNFTs(address);
    setNfts(fetchedNFTs);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Crypto & NFT Tracker</h2>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Card className="shadow-sm p-4">
        <Form.Group className="mb-3">
          <Form.Label>Enter Ethereum Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" className="mb-3" onClick={fetchData}>
          Fetch Data
        </Button>

        {balance !== null && (
          <p className="lead">ETH Balance: <strong>{balance}</strong> ETH</p>
        )}

        <h4>NFT Collection:</h4>
        <div className="d-flex flex-wrap">
          {nfts.length > 0 ? (
            nfts.map((nft, index) => (
              <Card className="m-2 shadow-sm" style={{ width: "10rem" }} key={index}>
                <Card.Img variant="top" src={nft.image_url} alt={nft.name} />
                <Card.Body>
                  <Card.Text className="text-truncate">
                    {nft.name || "Unnamed NFT"}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No NFTs found.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Crypto;
