const fetch = require("node-fetch");
const {assert} = require("chai");
const treasuryContract = artifacts.require("Treasury");

module.exports = function(callback) {
    (async () => {
        let index = 1;
        const contractInstance = await treasuryContract.deployed();
        const accounts = await web3.eth.getAccounts();
        const gameIndexer = await contractInstance.GameIndexer.call();
        let player = accounts[1];
        while(index <= Number(gameIndexer.toString())) {
            const game = await contractInstance.GetGame.call(Number(index), {from: accounts[0]});

            if (Number(game.State) === 1) {
                for(let i = 0; i < accounts.length; i++) {
                    if (game.PlayerAddress === accounts[i]) {
                        player = accounts[i];
                    }
                }
                await contractInstance.WithdrawWager(Number(game.Id), {from: player});
                console.log(`Withdrawing wager for game ${index}. Wager: ${game.Wager}, Player: ${game.PlayerAddress}`);
            }
            index++;
        }
        callback();
    })();
}
