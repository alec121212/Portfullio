import axios from "axios";

const OPENSEA_KEY = import.meta.env.VITE_OPENSEA_KEY;
const OPENSEA_URL = "https://api.opensea.io/api/v2/chain/ethereum/account";

export const getNFTs = async (address) => {
    try {
        const response = await axios.get(`${OPENSEA_URL}/${address}/nfts`, {
            headers: {
                "X-API-KEY": OPENSEA_KEY,
            },
        });

        return response.data.nfts;

    } catch(error){
        console.error("Error retrieving NFTs: ", error)
        return [];
    }
}