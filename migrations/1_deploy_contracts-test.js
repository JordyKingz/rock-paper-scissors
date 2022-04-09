const nft = artifacts.require("NFT");

module.exports = async(deployer, network, accounts) => {
  await deployer.deploy(nft, "https://placeholder.com/");
  await nft.deployed();
};