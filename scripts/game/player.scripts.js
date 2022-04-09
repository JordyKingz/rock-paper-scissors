const fetch = require("node-fetch");
const {assert} = require("chai");
const treasuryContract = artifacts.require("Treasury");

module.exports = function(callback) {
    (async () => {
        const accounts = await web3.eth.getAccounts()
        let counter = 0;
        let index = 3;
        // while(counter <= 5) {
            let player = accounts[9];

            try {
                // Create new player
                const response = await fetch('http://localhost:5000/player/create', {
                    headers: {"Content-Type": "application/json; charset=utf-8"},
                    method: 'POST',
                    body: JSON.stringify({
                        "walletAddress": player,
                    })
                }).then(res => res.json());
                console.log(`${response.message} with address: ${player}`);
            } catch (error) {
                console.log(error);
            }
            index += 1;
            // counter ++;
        // }
        callback();
    })();
}
