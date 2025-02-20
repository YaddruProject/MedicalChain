require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    buildbear: {
      // url: "https://rpc.buildbear.io/aggressive-hulk-0968b782"
      url: "https://rpc.buildbear.io/immediate-husk-775100ec"
    }
  }
};
