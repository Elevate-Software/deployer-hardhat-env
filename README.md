# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
This is the master guide to deploying and verifying a smart contract to the blockchain using Hardhat.

If you experience issues at any point, you can visit the hardhat docs directly.

## Prerequisites

To prepare for the rest of this tutorial, you need to have:
- npm (npx) version 8.5.5
- node version 16.13.1
  
The following is not required, but extremely useful:
- some familiarity with a command line
- some familiarity with JavaScript
  
## Creating your hardhat environment

Open your terminal and create a new directory.
```
mkdir hardhatDeployer
```
```
cd hardhatDeployer
```
Inside this directory, we want to start a new npm project (default settings are fine):
```
npm init -y
```
Install hardhat:
```
npm install --save-dev hardhat
```
Now we create a sample project:
```
npx hardhat
```
Hardhat will then generate a hardhat.config.js file for us along with a couple of folders with sample code we can work with, including contracts, scripts, and test.

To check if everything works properly, run:
```
npx hardhat test
```
NOTE: There may be missing dependencies you'll need to install if you had issues when attempting to run the above command.

We now have our hardhat development environment successfully configured.

Your project directory should now look something like this (I'm using tree to visualize):
```
C:\Users\Chase\Desktop\hardhatDeployer> tree -C -L 1
.
├── README.md
├── contracts
├── hardhat.config.js
├── node_modules
├── package-lock.json
├── package.json
├── scripts
└── test
```
The important folders and files are:
- **contracts** - folder where your smart contracts live
- **scripts** - folder where your hardhat Javascript scripts live -> our deploy logic will go here
- **hardhat.config.js** - configuration file with settings for solidity version and deployment

## Deploying and verifying your smart contract

First, create your contract or paste the contract you wish to deploy in a designated .sol file in the contracts folder.

Verify your contract is free of errors and is able to be compiled.

You can reference my environment in this guide here:
```
I will be deploying GogeDao.sol which can be found in the contracts folder.
Locate deploy.js in the scripts folder and ensure it looks something like this:
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy.
  const GogeDao = await hre.ethers.getContractFactory("GogeDAO");
  const gogeDao = await GogeDao.deploy();

  await gogeDao.deployed();

  console.log("GogeDao deployed to:", gogeDao.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
```
Your contract reference in line 11 will be different. Instead of "GogeDAO", this should match the contract name of the contract you're trying to deploy.

I will be deploying this contract to the Binance Smart Chain Testnet so my environment variables and chosen configuration is for that blockchain, but can be configured to any EVM testnet or mainnet.

Create a .env file in your environment and make sure it has the following variables:
```
TBSCSCAN_KEY = https://api-testnet.bscscan.com/
TBSC_RPC = https://rpc.ankr.com/bsc_testnet_chapel
TBSC_PK = <private key of deployer wallet>
```
The **TBSCSCAN_KEY** is the testnet.bscscan.com API key which will be needed to verify the smart contract later on.
The **TBSC_RPC** is the BSC Testnet rpc used to access/deploy to that specified chain.

Locate **hardhat.config.js** and ensure it looks like this:
```
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
```
This configuration includes smart contract size optimization in a case your contract is over the size limit, like mine is.

It also adds the bsc network script with the testnet environment variables mentioned prior.
Deploy the contract:
```
npx hardhat run scripts/deploy.js --network bsc
```
This command will run the deploy.js file and output a contract address:
-> GogeDao deployed to: 0x27771e23FbbF9365c0294BB2d77312F0595B69eE

Lastly, we will verify the contract on testnet.bscscan.com:
```
npx hardhat verify 0x27771e23FbbF9365c0294BB2d77312F0595B69eE --network bsc
```
We can confirm the deployment/verification by visiting the block explorer link directly
https://testnet.bscscan.com/address/0x27771e23FbbF9365c0294BB2d77312F0595B69eE#code
