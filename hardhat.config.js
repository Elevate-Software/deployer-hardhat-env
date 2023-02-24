require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const TBSCSCAN_KEY = process.env.TBSCSCAN_KEY;
const TBSC_RPC = process.env.TBSC_RPC;
const TBSC_PK = process.env.TBSC_PK;

module.exports = {
    solidity: {
        version: "0.8.13",
        settings: {
            optimizer: {
            enabled: true,
            runs: 200,
            },
        },
    },
    networks: {
        bsc: {
            url: TBSC_RPC,
            accounts: [TBSC_PK],
            gas: 300000000000,
        },
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
    },
    etherscan: {
        apiKey: TBSCSCAN_KEY
    }
};
