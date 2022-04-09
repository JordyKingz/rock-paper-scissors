const fetch = require("node-fetch");
const {assert} = require("chai");
const treasuryContract = artifacts.require("Treasury");

module.exports = function(callback) {
    (async () => {
        const contractInstance = await treasuryContract.deployed();
        const accounts = await web3.eth.getAccounts()
        let player = accounts[4];
        const action = 0;
        try {
            await contractInstance.SetWager(action, {from: player, value: web3.utils.toWei("0.1")});
            const gameId = await contractInstance.GameIndexer.call();
            console.log(`Play game with game id: ${gameId.toString()}`);
            const response = await fetch('http://localhost:5000/rps/play', {
                headers: {"Content-Type": "application/json; charset=utf-8"},
                method: 'POST',
                body: JSON.stringify({
                    "gameAction": action,
                    "walletAddress": player.toString(),
                    "gameId_SC": Number(gameId.toString())
                })
            }).then(res => res.json());

            if (response.result === 0) {
                console.log('Player wins');
                await contractInstance.GameResult(Number(gameId), {from: player});
            } else if (response.result === 2) {
                console.log("TIE");
                await contractInstance.GameResult(Number(gameId), {from: player});
            } else {
                console.log("Player loses");
            }
        } catch (error) {
            console.log(error);
        }
        console.log('\n');
        callback();
    })();
}
