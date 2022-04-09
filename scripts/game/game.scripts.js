const {assert} = require("chai");
const fetch = require("node-fetch");
const treasuryContract = artifacts.require("Treasury");

module.exports = function(callback) {
  (async () => {
    let counter = 0;
    let winCount = 0;
    let loseCount = 0;
    let tieCount = 0;
    const contractInstance = await treasuryContract.deployed();
    const accounts = await web3.eth.getAccounts()
    // 0 Rock, 1 Paper, 2 Scissors
    let action = 0;
    let player = accounts[3]; // 20 games
    while(counter <= 139) {
      if (counter > 19 && counter <= 50) {
        player = accounts[4]; // 30 games
        action = 1;
      } else if (counter > 50 && counter <= 75) {
        player = accounts[5]; // 25 games
        action = 2
      } else if (counter > 75 && counter <= 95) {
        player = accounts[6]; // 20 games
        action = 0;
      } else if (counter > 95 && counter <= 115) {
        player = accounts[7]; // 20 games
        action = 1;
      } else if (counter > 115 && counter <= 125) {
        player = accounts[8]; // 10 games
        action = 2;
      } else if (counter > 125) {
        player = accounts[9]; // 14 games
        action = 1;
      }

      try {
        await contractInstance.SetWager(action, {from: player, value: web3.utils.toWei("1")});
        const gameId = await contractInstance.GameIndexer.call();
        console.log(`Play game with game id: ${gameId.toString()}`);
        const playGame = async () => {
          try {
            return await fetch('http://localhost:5000/rps/play', {
              headers: {"Content-Type": "application/json; charset=utf-8"},
              method: 'POST',
              body: JSON.stringify({
                "gameAction": action,
                "walletAddress": player.toString(),
                "gameId_SC": Number(gameId.toString())
              })
            }).then(res => res.json());
          } catch(e) {
            await playGame();
          }
        }
        const response = await playGame();

        if (response.result === 0) {
          console.log('Player wins');
          winCount++;
        } else if (response.result === 2) {
          console.log("Tie");
          tieCount++;
        } else {
          console.log("Player loses");
          loseCount++;
        }
      } catch (error) {
        console.log(error);
      }
      console.log('\n');
      counter++;
    }

    console.log(`WINS: ${winCount}`);
    console.log(`LOSES: ${loseCount}`);
    console.log(`TIE: ${tieCount}`);
    callback();
  })();
}
