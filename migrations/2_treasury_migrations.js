const treasuryContract = artifacts.require("Treasury");
const bsb = artifacts.require("BlockShamBo");

module.exports = async(deployer, network, accounts) => {
    const bsbInstance  = await bsb.deployed();
    // Deploy contract, TreasuryOwner, TeamVault, default balance
    console.log(accounts[0]);
    await deployer.deploy(treasuryContract, accounts[0], accounts[9], web3.utils.toWei("100"));
    await treasuryContract.deployed();
};