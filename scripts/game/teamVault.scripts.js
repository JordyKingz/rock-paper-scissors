const fetch = require("node-fetch");
const {assert} = require("chai");
const treasuryContract = artifacts.require("Treasury");

module.exports = function(callback) {
    (async () => {
        const contractInstance = await treasuryContract.deployed();
        const accounts = await web3.eth.getAccounts()
        const owner = accounts[0]
        await contractInstance.WithdrawTeamVault({from: owner});
        console.log('Balance transferred to teamVault');
        callback();
    })();
}
