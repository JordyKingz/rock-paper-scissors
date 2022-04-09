const fetch = require("node-fetch");
const {assert} = require("chai");
const treasuryContract = artifacts.require("Treasury");

module.exports = function(callback) {
    (async () => {
            const contractInstance = await treasuryContract.deployed();
            const accounts = await web3.eth.getAccounts()
            const senderOne = accounts[0]
            // const senderTwo = accounts[7]
            try {
                await contractInstance.send(web3.utils.toWei("75"), {from: senderOne});
                // await contractInstance.send(web3.utils.toWei("45"), {from: senderTwo});
            } catch (error) {
                console.log(error);
            }
            console.log('Send Successful');
        callback();
    })();
}