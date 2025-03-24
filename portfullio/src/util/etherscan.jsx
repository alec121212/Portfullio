import axios from "axios";

const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_KEY;
const ETHERSCAN_URL = "https://api.etherscan.io/api";

export const getEthBalance = async (address) => {
    try{
        const response = await axios.get(ETHERSCAN_URL, {
            params: {
                module: "account",
                action: "balance",
                address,
                tag: "latest",
                apikey: ETHERSCAN_API_KEY,
            },
        });

        if (response.data.status === "1"){
            return (parseFloat(response.data.result) / 1e18).toFixed(4);
        } else {
            throw new Error(response.data.message);
        }
    } catch (error){
        console.error("Could not retrieve balance:", error);
        return null;
    }
};