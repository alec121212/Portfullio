import { useState } from "react"
import { getEthBalance } from "../util/etherscan"
import { getNFTs } from "../util/opensea"

const Crypto = () =>{

    /*temporary set and retrieval of addresses. Will update once we have backend and DB fully setup*/
    const [address, setAddress] = useState("")
    const [balance, setBalance] = useState(null)
    const [nfts, setNfts] = useState([]);

    const fetchData = async () => {
        if (!address) return

        const ethBalance = await getEthBalance(address);
        setBalance(ethBalance)

        const NFTs = await getNFTs(address);
        setNfts(NFTs)
    };

    return (
        <div className="crypto-container">
            <h2>Crypto & NFT Data</h2>
            <input
                type="text"
                placeholder="Enter Ethereum Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <button onClick={fetchData}>Fetch Data</button>

            {balance !== null && (
                <p>ETH Balance: {balance} ETH</p>
            )}

            <h3>NFT Collection:</h3>
            <div className="nft-grid">
                {nfts.length > 0 ? (
                    nfts.map((nft, index) => (
                        <div key={index} className="nft-card">
                            <img src={nft.image_url} alt={nft.name} width="100" />
                            <p>{nft.name || "Unnamed NFT"}</p>
                        </div>
                    ))
                ) : (
                    <p>No NFTs found.</p>
                )}
            </div>
        </div>
    );
}

export default Crypto