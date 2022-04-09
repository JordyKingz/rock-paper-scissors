const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    polygon: {
      provider: function() {
        return new HDWalletProvider(
            `${process.env.MNEMONIC}`, 
            `https://polygon-rpc.com`
        )
      },
      network_id: 137,
      // gas: 4721975,
      // gasPrice: 350000000000,
      //skipDryRun: true,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 50000,
	  },
    mumbai: {
      provider: function() {
        return new HDWalletProvider(
            `${process.env.MNEMONIC_TEST}`,
            `https://rpc-mumbai.maticvigil.com/`
        )
      },
      network_id: 80001,
      // gas: 4721975,
      // gasPrice: 350000000000,
      //skipDryRun: true,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 50000,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
          }
        }
      }
    },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    polygonscan: process.env.POLYGONSCAN_API_KEY
  }
};