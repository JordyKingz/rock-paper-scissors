const treasuryContract = artifacts.require("Treasury");
const bsb = artifacts.require("BlockShamBo");
const { time, BN } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const truffleAssert = require('truffle-assertions');
const { expect, assert} = require('chai');

contract('Treasury contract: Test BlockShamBo Game', (accounts) => {
    it('Should Fail: Cant\'t set 0 as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        try {
            await contractInstance.SetWager(0, {from: accounts[1], value: web3.utils.toWei("0")});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Can't set 0 as wager", "The error message should contain 'Error: Can't set 0 as wager'");
        }
    });
    it('Should Fail: Cant\'t set more than MAX_WAGER', async () => {
        const contractInstance = await treasuryContract.deployed();

        try {
            await contractInstance.SetWager(0, {from: accounts[1], value: web3.utils.toWei("350")});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Wager can't be more than MAX_WAGER", "The error message should contain 'Error: Wager can't be more than MAX_WAGER'");
        }
    });
    // PLAYER PLAYS ROCK
    it('Should Succeed: Player: Plays ROCK and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(0, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // first game played returns 1 as gameId
        assert.equal(gameId, 1, `The gameId should be 1 and it is ${gameId}`);
    });
    // UpdateGame system plays ROCK result PLAYER TIE
    it('Should Succeed: Treasury Owner update Game State to TIE', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.UpdateGame(1, 2, {from: accounts[9]}));
    });
    // PLAYER PLAYS ROCK
    it('Should Succeed: Player: Plays ROCK and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(0, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // first game played returns 2 as gameId
        assert.equal(gameId, 2, `The gameId should be 2 and it is ${gameId}`);
    });
    // UpdateGame system plays PAPER result PLAYER LOSES
    it('Should Succeed: Treasury Owner update Game State to LOSE', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.UpdateGame(2, 1, {from: accounts[9]}));
    });
    // PLAYER PLAYS ROCK
    it('Should Succeed: Player: Plays ROCK and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(0, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // first game played returns 3 as gameId
        assert.equal(gameId, 3, `The gameId should be 3 and it is ${gameId}`);
    });
    // UpdateGame system plays SCISSORS result PLAYER WIN
    it('Should Succeed: Treasury Owner update Game State to WIN', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.UpdateGame(3, 0, {from: accounts[9]}));
    });
    // PLAYER PLAYS PAPER
    it('Should Succeed: Player: Plays PAPER and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(1, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // second game played returns 4 as gameId
        assert.equal(gameId, 4, `The gameId should be 4 and it is ${gameId}`);
    });
    // UpdateGame system plays ROCK result PLAYER WIN
    it('Should Succeed: Treasury Owner update Game State to WIN', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.UpdateGame(4, 0, {from: accounts[9]}));
    });
    // PLAYER PLAYS PAPER
    it('Should Succeed: Player: Plays PAPER and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(1, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // second game played returns 5 as gameId
        assert.equal(gameId, 5, `The gameId should be 5 and it is ${gameId}`);
    });
    // UpdateGame system plays PAPER result PLAYER TIE
    it('Should Succeed: Treasury Owner update Game State to TIE', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.UpdateGame(5, 2, {from: accounts[9]}));
    });
    // PLAYER PLAYS PAPER
    it('Should Succeed: Player: Plays PAPER and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(1, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // second game played returns 6 as gameId
        assert.equal(gameId, 6, `The gameId should be 6 and it is ${gameId}`);
    });
    // UpdateGame system plays SCISSORS result PLAYER LOSES
    it('Should Succeed: Treasury Owner update Game State to LOSES', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.UpdateGame(6, 1, {from: accounts[9]}));
    });
    // PLAYER PLAYS SCISSOR
    it('Should Succeed: Player: Plays SCISSORS and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(2, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // third game played returns 7 as gameId
        assert.equal(gameId, 7, `The gameId should be 7 and it is ${gameId}`);
    });
    // UpdateGame system plays ROCK result PLAYER LOSES
    it('Should Succeed: Treasury Owner update Game State to LOSES', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.UpdateGame(7, 1, {from: accounts[9]}));
    });
    // PLAYER PLAYS SCISSOR
    it('Should Succeed: Player: Plays SCISSORS and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(2, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // third game played returns 8 as gameId
        assert.equal(gameId, 8, `The gameId should be 8 and it is ${gameId}`);
    });
    // UpdateGame system plays PAPER result PLAYER WINS
    it('Should Succeed: Treasury Owner update Game State to WIN', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.UpdateGame(8, 0, {from: accounts[9]}));
    });
    // PLAYER PLAYS SCISSOR
    it('Should Succeed: Player: Plays SCISSORS and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(2, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // third game played returns 9 as gameId
        assert.equal(gameId, 9, `The gameId should be 9 and it is ${gameId}`);
    });
    // UpdateGame system plays SCISSORS result PLAYER TIE
    it('Should Succeed: Treasury Owner update Game State to TIE', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.UpdateGame(9, 2, {from: accounts[9]}));
    });
    it('Should Fail: Setting unvalid game action', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.SetWager(3, {from: accounts[2], value: web3.utils.toWei("1")});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Invalid game action", "The error message should contain 'Error: Invalid game action'");
        }
    });
    // PLAYER RESULTS
    it('Should Fail: Sender is not Player of the Game', async () => {
        const contractInstance = await treasuryContract.deployed();

        try {
            await contractInstance.GameResult(1, {from: accounts[2]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Sender is not player of the game", "The error message should contain 'Error: Sender is not player of the game'");
        }
    });
    // PLAYER PLAYS ROCK
    it('Should Succeed: Player: Plays ROCK and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(0, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // first game played returns 10 as gameId
        assert.equal(gameId, 10, `The gameId should be 10 and it is ${gameId}`);
    });
    it('Should Fail: Game State is not set to GameUpdated, Can not fetch GameResult', async () => {
        const contractInstance = await treasuryContract.deployed();

        try {
            await contractInstance.GameResult(10, {from: accounts[1]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Game state don't match", "The error message should contain 'Error: Game state don't match'");
        }
    });
    it('Should Fail: Sender is not the treasury owner', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.UpdateGame(10, 0, {from: accounts[8]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Sender is not the treasury owner", "The error message should contain 'Error: Sender is not the treasury owner'");
        }
    });
    // PLAYER PLAYS TIE RETURN WAGER
    it('Should Succeed: GameId: 1 Player TIE return wager', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.GameResult(1, {from: accounts[1]}));
    });
    // PLAYER PLAYS TIE RETURN WAGER
    it('Should Succeed: GameId: 5 Player TIE return wager', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.GameResult(5, {from: accounts[1]}));
    });
    // TOGGLE DOUBLE RETURN
    it('Should Succeed: Set DOUBLE_RETURN to TRUE', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.ToggleDoubleReturn({from: accounts[0]}));
    });
    // PLAYER PLAYS WIN DOUBLE WAGER
    it('Should Succeed: GameId: 3 Player WIN double wager', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.GameResult(3, {from: accounts[1]}));
    });
    // TOGGLE DOUBLE RETURN NOT OWNER
    it('Should Fail: Toggle DOUBLE_RETURN not as owner', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.ToggleDoubleReturn({from: accounts[8]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Ownable: caller is not the owner", "The error message should contain 'Ownable: caller is not the owner'");
        }
    });
    // TOGGLE DOUBLE RETURN
    it('Should Succeed: Set DOUBLE_RETURN to FALSE', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.ToggleDoubleReturn({from: accounts[0]}));
    });
    // PLAYER PLAYS WIN DOUBLE WAGER
    it('Should Succeed: GameId: 4 Player WIN double wager', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.GameResult(4, {from: accounts[1]}));
    });
    // PLAYER PLAYS WIN DOUBLE WAGER
    it('Should Succeed: GameId: 8 Player WIN double wager', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.GameResult(8, {from: accounts[1]}));
    });
    it('Should Fail: Update don\'t existing game', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.UpdateGame(11, 1, {from: accounts[9]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Game doesn't exist", "The error message should contain 'Error: Game doesn't exist'");
        }
    });
    it('Should Succeed: TAKE_FEE is set to true', async () => {
        const contractInstance = await treasuryContract.deployed();
        const takeFee = await contractInstance.TAKE_FEE.call();
        // takeFee is set to true
        assert.equal(takeFee, true, `The takeFee should be true but is ${takeFee}`);
    });
    it('Should Succeed: Toggle TAKE_FEE', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.ToggleTakeFee({from: accounts[0]}));
    });
    it('Should Succeed: TAKE_FEE is set to false', async () => {
        const contractInstance = await treasuryContract.deployed();
        const takeFee = await contractInstance.TAKE_FEE.call();
        // takeFee is set to false
        assert.equal(takeFee, false, `The takeFee should be false but is ${takeFee}`);
    });
    // SYSTEM WINS SO NO FEES ARE TAKEN
    // PLAYER PLAYS PAPER
    it('Should Succeed: Player: Plays PAPER and set 1ETH as wager', async () => {
        const contractInstance = await treasuryContract.deployed();

        assert.ok(await contractInstance.SetWager(1, {from: accounts[1], value: web3.utils.toWei("1")}));

        const gameId = await contractInstance.GameIndexer.call();
        // second game played returns 11 as gameId
        assert.equal(gameId, 11, `The gameId should be 11 and it is ${gameId}`);
    });
    // UpdateGame system plays SCISSORS result PLAYER LOSES
    it('Should Succeed: Treasury Owner update Game State to LOSES', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.UpdateGame(11, 1, {from: accounts[9]}));
    });
    it('Should Succeed: Toggle TAKE_FEE', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.ToggleTakeFee({from: accounts[0]}));
    });
    // DISTRIBUTE FEES TO NFT VAULT AND TEAM VAULT
    it('Should Succeed: Owner calls DistributeFees', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.DistributeFeesBackToVaults({from: accounts[0]}));
    });
    it('Should Succeed: DOUBLE_RETURN is set to false', async () => {
        const contractInstance = await treasuryContract.deployed();
        const bool = await contractInstance.DOUBLE_RETURN.call();
        // takeFee is set to true
        assert.equal(bool, false, `The takeFee should be false but is ${bool}`);
    });
    it('Should Succeed: Toggle DOUBLE_RETURN', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.ToggleDoubleReturn({from: accounts[0]}));
    });
    it('Should Succeed: DOUBLE_RETURN is set to true', async () => {
        const contractInstance = await treasuryContract.deployed();
        const bool = await contractInstance.DOUBLE_RETURN.call();
        // takeFee is set to true
        assert.equal(bool, true, `The DOUBLE_RETURN should be true but is ${bool}`);
    });
    // CHECK TEAM VAULT BALANCE
    it('Should Succeed: TeamVaultBalance contains 0.8236 ETH from FEES', async () => {
        const contractInstance = await treasuryContract.deployed();
        const balance = await contractInstance.TeamVaultBalance.call();
        assert.equal(balance, web3.utils.toWei("0.8236"), `The balance should be 0.8236 ETH but is ${web3.utils.fromWei(balance.toString())}`);
    });
    // Set Max Wager
    it('Should Succeed: Owner set Max Wager to 10ETH', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.SetMaxWager(web3.utils.toWei("10"), {from: accounts[0]}));
    });
    it('Should Fail: Cant\'t set more than MAX_WAGER', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.SetWager(0, {from: accounts[1], value: web3.utils.toWei("15")});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Wager can't be more than MAX_WAGER", "The error message should contain 'Error: Wager can't be more than MAX_WAGER'");
        }
    });
    it('Should Fail: Not the owner setting Max Wager to 250ETH', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.SetMaxWager(web3.utils.toWei("250"), {from: accounts[1]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Ownable: caller is not the owner", "The error message should contain 'Ownable: caller is not the owner'");
        }
    });
    it('Should Succeed: Owner set Max Wager to 250ETH', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.SetMaxWager(web3.utils.toWei("250"), {from: accounts[0]}));
    });
    // Treasury Owner
    it('Should Succeed: Get Treasury Owner address', async () => {
        const contractInstance = await treasuryContract.deployed();
        const walletAddress = await contractInstance.TREASURY_OWNER.call();
        assert.equal(walletAddress, accounts[9], `The address should be ${accounts[9]} but is ${walletAddress}`);
    });
    it('Should Succeed: Set Treasury Owner to accounts[8]', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.SetTreasuryOwner(accounts[8], {from: accounts[0]}));
    });
    it('Should Succeed: Get Treasury Owner address', async () => {
        const contractInstance = await treasuryContract.deployed();
        const walletAddress = await contractInstance.TREASURY_OWNER.call();
        assert.equal(walletAddress, accounts[8], `The address should be ${accounts[8]} but is ${walletAddress}`);
    });
    it('Should Fail: Not the owner setting new SetTreasuryOwner', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.SetTreasuryOwner(accounts[9], {from: accounts[1]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Ownable: caller is not the owner", "The error message should contain 'Ownable: caller is not the owner'");
        }
    });
    it('Should Succeed: Set Treasury Owner back to accounts[9]', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.SetTreasuryOwner(accounts[9], {from: accounts[0]}));
    });
    // Set Team Vault
    it('Should Succeed: Get Team Vault address', async () => {
        const contractInstance = await treasuryContract.deployed();
        const walletAddress = await contractInstance.TEAM_VAULT.call();
        assert.equal(walletAddress, accounts[8], `The address should be ${accounts[8]} but is ${walletAddress}`);
    });
    it('Should Succeed: Set Team Vault to accounts[9]', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.SetTeamVault(accounts[9], {from: accounts[0]}));
    });
    it('Should Succeed: Get Team vault address', async () => {
        const contractInstance = await treasuryContract.deployed();
        const walletAddress = await contractInstance.TEAM_VAULT.call();
        assert.equal(walletAddress, accounts[9], `The address should be ${accounts[9]} but is ${walletAddress}`);
    });
    it('Should Fail: Not the owner setting new SetTeamVault', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.SetTeamVault(accounts[8], {from: accounts[1]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Ownable: caller is not the owner", "The error message should contain 'Ownable: caller is not the owner'");
        }
    });
    it('Should Succeed: Set Team Vault back to accounts[8]', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.SetTeamVault(accounts[8], {from: accounts[0]}));
    });
    // Set NFT Vault
    it('Should Succeed: Get NFT Vault address', async () => {
        const contractInstance = await treasuryContract.deployed();
        const walletAddress = await contractInstance.NFT_VAULT.call();
        assert.equal(walletAddress, accounts[7], `The address should be ${accounts[7]} but is ${walletAddress}`);
    });
    it('Should Succeed: Set NFT Vault to accounts[8]', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.SetNFTVault(accounts[8], {from: accounts[0]}));
    });
    it('Should Succeed: Get NFT address', async () => {
        const contractInstance = await treasuryContract.deployed();
        const walletAddress = await contractInstance.NFT_VAULT.call();
        assert.equal(walletAddress, accounts[8], `The address should be ${accounts[8]} but is ${walletAddress}`);
    });
    it('Should Fail: Not the owner setting new SetTeamVault', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.SetNFTVault(accounts[7], {from: accounts[1]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Ownable: caller is not the owner", "The error message should contain 'Ownable: caller is not the owner'");
        }
    });
    it('Should Succeed: Set NFT Vault back to accounts[8]', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.SetNFTVault(accounts[7], {from: accounts[0]}));
    });
    // Withdraw wager when game is not played yet
    it('Should Fail: Withdraw wager when game is not played yet', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            assert.ok(await contractInstance.SetWager(0, {from: accounts[1], value: web3.utils.toWei("1")}));
            const gameId = await contractInstance.GameIndexer.call();
            assert.ok(await contractInstance.UpdateGame(gameId, 0, {from: accounts[9]}));
            await contractInstance.WithdrawWager(gameId.toString(), {from: accounts[1]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Game state don't match", "The error message should contain 'Error: Game state don't match'");
        }
    });
    it('Should Fail: Withdraw wager from non existing game', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            let gameId = await contractInstance.GameIndexer.call();
            gameId = Number(gameId) + 1;
            await contractInstance.WithdrawWager(gameId.toString(), {from: accounts[1]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Game doesn't exist", "The error message should contain 'Error: Game doesn't exist'");
        }
    });
    it('Should Succeed: Withdraw wager when game is not played yet', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.SetWager(0, {from: accounts[1], value: web3.utils.toWei("1")}));
        const gameId = await contractInstance.GameIndexer.call();
        assert.ok(await contractInstance.WithdrawWager(gameId.toString(), {from: accounts[1]}));
    });
    it('Should Fail: Withdraw wager from other player', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            assert.ok(await contractInstance.SetWager(0, {from: accounts[1], value: web3.utils.toWei("1")}));
            const gameId = await contractInstance.GameIndexer.call();
            await contractInstance.WithdrawWager(gameId.toString(), {from: accounts[2]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Only player can withdraw wager", "The error message should contain 'Error: Only player can withdraw wager'");
        }
    });
    it('Should Succeed: Get default balance', async () => {
        const contractInstance = await treasuryContract.deployed();
        const defaultBalance = await contractInstance.DEFAULT_BALANCE.call();
        assert.equal(defaultBalance, web3.utils.toWei("100"), `Expect default balance to be 100 but is ${web3.utils.fromWei(defaultBalance.toString())}`);
    });
    it('Should Succeed: Get balance of treasury', async () => {
        const contractInstance = await treasuryContract.deployed();
        const treasuryBalance = await web3.eth.getBalance(contractInstance.address);
        assert.equal(treasuryBalance, web3.utils.toWei("3.28"), `Expect default balance to be 3.28 but is ${web3.utils.fromWei(treasuryBalance.toString())}`);
    });
    it('Should Succeed: Set treasury balance to default', async () => {
        const contractInstance = await treasuryContract.deployed();
        const accounts = await web3.eth.getAccounts()
        const senderOne = accounts[8]
        const senderTwo = accounts[9]
        // Send 105ETH to contract
        try {
            await contractInstance.send(web3.utils.toWei("50"), {from: senderOne});
            await contractInstance.send(web3.utils.toWei("55"), {from: senderTwo});
        } catch (error) {
            console.log(error);
        }
        // Balance should be 105ETH
        const treasuryBalanceBefore = await web3.eth.getBalance(contractInstance.address);
        assert.equal(treasuryBalanceBefore, web3.utils.toWei("108.28"), `The treasury balance should be 108.28 but is ${web3.utils.fromWei(treasuryBalanceBefore.toString())}`);

        // Set back to default = 100 ETH
        try {
            assert.ok(await contractInstance.SetTreasuryBalanceToDefault({from: accounts[0]}));
        } catch (error) {
            console.log(error);
        }
        // Check balance
        const defaultBalance = await contractInstance.DEFAULT_BALANCE.call();
        const treasuryBalanceAfter = await web3.eth.getBalance(contractInstance.address);
        assert.equal(treasuryBalanceAfter, defaultBalance, `The treasury balance should be ${web3.utils.fromWei(defaultBalance.toString())} but is ${web3.utils.fromWei(treasuryBalanceAfter.toString())}`);
    });
    it('Should Fail: Set treasury balance to default but balance is too low', async () => {
        const contractInstance = await treasuryContract.deployed();
        const accounts = await web3.eth.getAccounts()

        const treasuryBalanceBefore = await web3.eth.getBalance(contractInstance.address);
        assert.equal(treasuryBalanceBefore, web3.utils.toWei("100"), `The treasury balance should be 100 but is ${web3.utils.fromWei(treasuryBalanceBefore.toString())}`);

        try {
            await contractInstance.SetTreasuryBalanceToDefault({from: accounts[0]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Treasury balance is less than default balance", "The error message should contain 'Error: Treasury balance is less than default balance'");
        }
    });
    it('Should Fail: Set treasury balance to default not owner calling', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.SetTreasuryBalanceToDefault({from: accounts[2]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Ownable: caller is not the owner", "The error message should contain 'Ownable: caller is not the owner'");
        }
    });
    it('Should Succeed: Get game', async () => {
        const contractInstance = await treasuryContract.deployed();
        const gameId = await contractInstance.GameIndexer.call();
        const game = await contractInstance.GetGame.call(Number(gameId), {from: accounts[0]});
        assert.equal(game.Id, gameId, `Expect game Id to be ${gameId} but is ${game.Id}`);
    });
    it('Should Fail: Get non existing game', async () => {
        const contractInstance = await treasuryContract.deployed();
        let gameId = await contractInstance.GameIndexer.call();
        gameId = Number(gameId) + 1;
        try {
            await contractInstance.GetGame.call(Number(gameId), {from: accounts[0]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Game doesn't exist", "The error message should contain 'Error: Game doesn't exist'");
        }
    });
    it('Should Succeed: Check vault balances', async () => {
        const contractInstance = await treasuryContract.deployed();
        const teamVaultBalance = await contractInstance.TeamVaultBalance.call();
        const nftVaultBalance = await contractInstance.NFTVaultBalance.call();
        const feeVaultBalance = await contractInstance.FeeVaultBalance.call();

        assert.equal(teamVaultBalance, web3.utils.toWei("0.8236"), `Expect team vault balance to be 0.8236 but is ${web3.utils.fromWei(teamVaultBalance.toString())}`);
        assert.equal(nftVaultBalance, web3.utils.toWei("0.5964"), `Expect NFT vault balance to be 0.5964 but is ${web3.utils.fromWei(nftVaultBalance.toString())}`);
        assert.equal(feeVaultBalance, web3.utils.toWei("0.07"), `Expect fee vault balance to be 0.07 but is ${web3.utils.fromWei(feeVaultBalance.toString())}`);
    });
    it('Should Fail: Not the owner calling WithdrawTeamVault', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.WithdrawTeamVault({from: accounts[5]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Ownable: caller is not the owner", "The error message should contain 'Ownable: caller is not the owner'");
        }
    });
    it('Should Succeed: Owner calls WithdrawTeamVault', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.WithdrawTeamVault({from: accounts[0]}));
    });
    // NFT Distribution tests
    it('Should Succeed: Ditribute NFT fee to token holders', async () => {
        const contractInstance = await treasuryContract.deployed();
        const bsbInstance = await bsb.deployed();
        const totalSupply = await bsbInstance.totalSupply.call();
        assert.equal(totalSupply, 550, `Expect total supply to be 550 but is ${totalSupply.toString()}`);

    });
});

contract('Treasury contract: Set default balances', (accounts) => {
    // Set default balance
    it('Should Fail: Set lower default balance', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.SetDefaultBalance(web3.utils.toWei("50"), {from: accounts[0]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Error: Default balance must be greater than current balance", "The error message should contain 'Error: Default balance must be greater than current balance'");
        }
    });
    it('Should Succeed: Set default balance', async () => {
        const contractInstance = await treasuryContract.deployed();
        assert.ok(await contractInstance.SetDefaultBalance(web3.utils.toWei("200"), {from: accounts[0]}));
    });
    it('Should Succeed: Get DEFAULT_BALANCE', async () => {
        const contractInstance = await treasuryContract.deployed();
        const balance = await contractInstance.DEFAULT_BALANCE.call();
        assert.equal(balance, web3.utils.toWei("200"), `The default balance should be 200 ETH but is ${web3.utils.fromWei(balance.toString())}`);
    });
    it('Should Fail: Not the owner setting default balance', async () => {
        const contractInstance = await treasuryContract.deployed();
        try {
            await contractInstance.SetDefaultBalance(web3.utils.toWei("100"), {from: accounts[1]});
            assert.fail("The transaction should have thrown an error");
        } catch (err) {
            assert.include(err.message, "Ownable: caller is not the owner", "The error message should contain 'Ownable: caller is not the owner'");
        }
    });
});
