const fetch = require("node-fetch");
const {assert} = require("chai");
const treasuryContract = artifacts.require("Treasury");
const nftContract = artifacts.require("NFT");

module.exports = function(callback) {
  (async () => {
    let counter = 0;
    const contractInstance = await nftContract.deployed();
    const accounts = await web3.eth.getAccounts()

    let minter = accounts[1]; // 0-49 50 NFTs
    while (counter <= 549) {
      if (counter > 49 && counter <= 150) {
        minter = accounts[2]; // 50-150 100 NFTs
      } else if (counter > 150 && counter <= 200) {
        minter = accounts[3]; // 151-200 50 NFTs
      } else if (counter > 200 && counter <= 225) {
        minter = accounts[4]; // 201-225 25 NFTs
      } else if (counter > 225 && counter <= 300) {
        minter = accounts[5]; // 226-300 75 NFTs
      } else if (counter > 300 && counter <= 360) {
        minter = accounts[6]; // 301-360 60 NFTs
      } else if (counter > 360 && counter <= 445) {
        minter = accounts[7]; // 361-445 85 NFTs
      } else if (counter > 445 && counter <= 500) {
        minter = accounts[8]; //446-500 55 NFTs
      } else if (counter > 500) {
        minter = accounts[9]; // 501-549 49 NFTs
      }
      // Mint NFT
      try {
        await contractInstance.Mint(1, {from: minter, value: web3.utils.toWei("0.1")});
        const totalSupply = await contractInstance.totalSupply.call();
        console.log(`NFT #${totalSupply.toString()} minted.`);
      } catch (error) {
        console.log(error);
      }
      console.log('\n');
      counter++;
    }
    console.log(`Total NFTs minted: ${counter}`);

    callback();
  })();
}
