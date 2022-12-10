require("@nomicfoundation/hardhat-toolbox");

const INFURAURL = 'https://goerli.infura.io/v3/72fc306af04f4681aba4141de9d2ce46';
const privatekey = 'd8ae0697abe34fbff3894ef6d9e202f94c2d883c83574b29296e6790d8ec749d';


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:{
    goerli:{
      url: INFURAURL,
      accounts: [privatekey],
    }
  }
};
