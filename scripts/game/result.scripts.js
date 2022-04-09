const fetch = require("node-fetch");
const {assert} = require("chai");
const treasuryContract = artifacts.require("Treasury");

module.exports = function(callback) {
    (async () => {
            const contractInstance = await treasuryContract.deployed();
            const accounts = await web3.eth.getAccounts()
            const player = accounts[4]
            try {
                const gameId = 1; // ID of game
                await contractInstance.GameResult(Number(gameId.toString()), {from: player});
            } catch (error) {
                console.log(error);
            }
            console.log('Game Result Successful');
        callback();
    })();
}
