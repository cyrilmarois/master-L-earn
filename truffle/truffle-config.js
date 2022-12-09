const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config();

module.exports = {
  contracts_build_directory: "../client/src/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 8e20,
      gasPrice: 2000000000,
    },
    goerli: {
     provider: function() {return new HDWalletProvider({
      privateKeys:[`${process.env.PRIVATE_KEY}`], 
      providerOrUrl:`https://goerli.infura.io/v3/${process.env.INFURA_ID}`})},
     network_id: "5",
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 4000 // Default: 200
        }
      }
    }
  },
};
