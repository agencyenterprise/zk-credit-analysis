import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const DEFAULT_NETWORK: any = process.env.DEFAULT_NETWORK;
const ACCOUNT_ONE: any = process.env.ACCOUNT_ONE;
const MUMBAI_URL: any = process.env.MUMBAI_URL;
const POLYGONSCAN_API_KEY: any = process.env.POLYGONSCAN_API_KEY;

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    defaultNetwork: DEFAULT_NETWORK,
    networks: {
        mumbai: {
            url: MUMBAI_URL,
            accounts: [ACCOUNT_ONE],
        },
    },
    etherscan: {
        apiKey: {
            polygonMumbai: POLYGONSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        coinmarketcap: "3407cb8d-912b-4d43-9ad5-4cc244cac3cb",
        token: "ETH",
    },
};

export default config;
