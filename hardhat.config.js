require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

// Define the Goerli URL and private key
const INFRA_URL = 'https://goerli.infura.io/v3/ef76fe8d28bd45859233faf7b7bf1b94';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: INFRA_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};