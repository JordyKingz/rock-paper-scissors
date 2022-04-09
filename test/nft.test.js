const nftContract = artifacts.require("NFT");
const { time, BN } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');

contract('Public sale tests', (accounts) =>{
    it('should fail: try to mint not started', async() =>{
        const contractInstance = await nftContract.deployed();
        try{
            await contractInstance.Mint(1, {from: accounts[1], value: web3.utils.toWei("0.1")})
            assert.fail("The transaction should have thrown an error");
        }
        catch(err){
            assert.include(err.message, "Minting has not yet started", "The error message should contain 'Minting has not yet started'");
        }
    });
    it('should succeed: toggle minting', async() =>{
        const contractInstance = await nftContract.deployed();
        assert.ok(await contractInstance.ToggleMinting());
    });

    it('should fail: try to mint more than allowed in single transaction', async() =>{
        const contractInstance = await nftContract.deployed();
        try{
            await contractInstance.Mint(4, {from: accounts[1], value: web3.utils.toWei("0.4")})
            assert.fail("The transaction should have thrown an error");
        }
        catch(err){
            assert.include(err.message, "Cannot mint more than allowed", "The error message should contain 'Cannot mint more than allowed'");
        }
    });

    it('should fail: try to mint with not enough eth send', async() =>{
        const contractInstance = await nftContract.deployed();
        try{
            await contractInstance.Mint(1, {from: accounts[1], value: web3.utils.toWei("0.05")})
            assert.fail("The transaction should have thrown an error");
        }
        catch(err){
            assert.include(err.message, "Not enough matic send", "The error message should contain 'Not enough matic send'");
        }
    });

    it('Should fail: try to transfer eth as non owner', async() =>{
        const contractInstance = await nftContract.deployed();
        try{
            const treasuryBalance = await web3.eth.getBalance(contractInstance.address);
            await contractInstance.send(treasuryBalance.toString(), {from: accounts[1]});
            await contractInstance.TransferMatic({from: accounts[1]})
            assert.fail("The transaction should have thrown an error");
        }
        catch(err){
            assert.include(err.message, "Ownable: caller is not the owner", "The error message should contain 'Ownable: caller is not the owner'");
        }
    });

    it('Should fail: try to set base uri as non owner', async() =>{
        const contractInstance = await nftContract.deployed();
        try{
            await contractInstance.SetBaseUri("test.lol", {from: accounts[1]})
            assert.fail("The transaction should have thrown an error");
        }
        catch(err){
            assert.include(err.message, "Ownable: caller is not the owner", "The error message should contain 'Ownable: caller is not the owner'");
        }
    });

    it('Should fail: try to transfer eth when 0 available', async() =>{
        const contractInstance = await nftContract.deployed();
        try{
            await contractInstance.TransferMatic({from: accounts[0]})
            assert.fail("The transaction should have thrown an error");
        }
        catch(err){
            assert.include(err.message, "No matic present", "The error message should contain 'No matic present'");
        }
    });

    it('Should succeed: Mint 1 nft', async() =>{
        const contractInstance = await nftContract.deployed();

        const initBalanceOfAccount1 = await web3.eth.getBalance(accounts[1]);
        const initBalanceOfBsbInstances = await web3.eth.getBalance(contractInstance.address);
        expect(initBalanceOfBsbInstances).to.be.bignumber.equal(web3.utils.toBN('0'));

        await contractInstance.Mint(1, {from: accounts[1], value: web3.utils.toWei("0.01")});

        const afterBalanceOfAccount1 = await web3.eth.getBalance(accounts[1]);
        const afterBalanceOfBsbInstances = await web3.eth.getBalance(bsbInstance.address);
        expect(afterBalanceOfAccount1).to.be.bignumber.lessThan(web3.utils.toBN(initBalanceOfAccount1).sub(web3.utils.toBN(web3.utils.toWei("0.01").toString())));
        expect(afterBalanceOfBsbInstances).to.be.bignumber.equal(web3.utils.toBN(web3.utils.toWei("0.01").toString()));

        const nftBalanceOfAccount1 = await bsbInstance.balanceOf(accounts[1]);
        expect(nftBalanceOfAccount1).to.be.bignumber.equal(web3.utils.toBN('1'));
        const ownerOfNft1 = await bsbInstance.ownerOf(1);
        expect(ownerOfNft1).equal(accounts[1]);
        const nftUri = await bsbInstance.tokenURI(1);
        expect(nftUri).equal('https://test.com/api/1');
    });

    it('Should succeed: Mint 2 additional nfts', async() =>{
        const contractInstance = await nftContract.deployed();

        const initBalanceOfAccount1 = await web3.eth.getBalance(accounts[1]);
        const initBalanceOfBsbInstances = await web3.eth.getBalance(contractInstance.address);
        expect(initBalanceOfBsbInstances).to.be.bignumber.equal(web3.utils.toBN(web3.utils.toWei("0.01").toString()));

        await contractInstance.Mint(2, {from: accounts[1], value: web3.utils.toWei("0.02")});

        const afterBalanceOfAccount1 = await web3.eth.getBalance(accounts[1]);
        const afterBalanceOfBsbInstances = await web3.eth.getBalance(bsbInstance.address);
        expect(afterBalanceOfAccount1).to.be.bignumber.lessThan(web3.utils.toBN(initBalanceOfAccount1).sub(web3.utils.toBN(web3.utils.toWei("0.01").toString())));
        expect(afterBalanceOfBsbInstances).to.be.bignumber.equal(web3.utils.toBN(initBalanceOfBsbInstances).add(web3.utils.toBN(web3.utils.toWei("0.02").toString())));

        const nftBalanceOfAccount1 = await bsbInstance.balanceOf(accounts[1]);
        expect(nftBalanceOfAccount1).to.be.bignumber.equal(web3.utils.toBN('3'));

        const ownerOfNft1 = await bsbInstance.ownerOf(1);
        expect(ownerOfNft1).equal(accounts[1]);
        const nftUri = await bsbInstance.tokenURI(1);
        expect(nftUri).equal('https://test.com/api/1');

        const ownerOfNft2 = await bsbInstance.ownerOf(2);
        expect(ownerOfNft2).equal(accounts[1]);
        const nftUri2 = await bsbInstance.tokenURI(2);
        expect(nftUri2).equal('https://test.com/api/2');

        const ownerOfNft3 = await bsbInstance.ownerOf(3);
        expect(ownerOfNft3).equal(accounts[1]);
        const nftUri3 = await bsbInstance.tokenURI(3);
        expect(nftUri3).equal('https://test.com/api/3');

        let totalSupply = await bsbInstance.totalSupply()
        expect(totalSupply).to.be.bignumber.equal(web3.utils.toBN('3'));
        let maxSupply = await bsbInstance.maxSupply.call()
        expect(maxSupply).to.be.bignumber.equal(web3.utils.toBN('550'));
    });

    it('Should succeed: set base uri as owner', async() =>{
        const contractInstance = await nftContract.deployed();

        let nftUri = await contractInstance.tokenURI(1);
        expect(nftUri).equal('https://test.com/api/1');

        await contractInstance.SetBaseUri("https://lol.lol/api/", {from: accounts[0]})
        let nftUriAfter = await contractInstance.tokenURI(1);
        expect(nftUriAfter).equal('https://lol.lol/api/1');
    });

    it('should fail: try to mint more than max supply', async() =>{
        const contractInstance = await nftContract.deployed();
        try{
            await contractInstance.Mint(2, {from: accounts[2], value: web3.utils.toWei("0.2")});
            await contractInstance.Mint(2, {from: accounts[3], value: web3.utils.toWei("0.2")});
            await contractInstance.Mint(2, {from: accounts[4], value: web3.utils.toWei("0.2")});
            await contractInstance.Mint(2, {from: accounts[5], value: web3.utils.toWei("0.2")});
            assert.fail("The transaction should have thrown an error");
        }
        catch(err){
            assert.include(err.message, "You cannot exceed max supply", "The error message should contain 'You cannot exceed max supply'");
        }
    });

    it('Should succeed: get totalminted', async() =>{
        const contractInstance = await nftContract.deployed();
        let totalMintedAccount1 = await contractInstance.TotalMinted.call(accounts[1])
        expect(totalMintedAccount1).to.be.bignumber.equal(web3.utils.toBN('3'));
        let totalMintedAccount2 = await contractInstance.TotalMinted.call(accounts[2])
        expect(totalMintedAccount2).to.be.bignumber.equal(web3.utils.toBN('2'));
        let totalMintedAccount3 = await contractInstance.TotalMinted.call(accounts[3])
        expect(totalMintedAccount3).to.be.bignumber.equal(web3.utils.toBN('2'));
        let totalMintedAccount4 = await contractInstance.TotalMinted.call(accounts[4])
        expect(totalMintedAccount4).to.be.bignumber.equal(web3.utils.toBN('2'));
        let totalSupply = await contractInstance.totalSupply()
        expect(totalSupply).to.be.bignumber.equal(web3.utils.toBN('9'));
    });

    it('Should succeed: get totalminted2', async() =>{
        const contractInstance = await nftContract.deployed();
        let totalMintedAccount1 = await contractInstance.TotalMinted.call(accounts[1])
        expect(totalMintedAccount1).to.be.bignumber.equal(web3.utils.toBN('3'));
        let totalMintedAccount2 = await contractInstance.TotalMinted.call(accounts[2])
        expect(totalMintedAccount2).to.be.bignumber.equal(web3.utils.toBN('2'));
        let totalMintedAccount3 = await contractInstance.TotalMinted.call(accounts[3])
        expect(totalMintedAccount3).to.be.bignumber.equal(web3.utils.toBN('2'));
        let totalMintedAccount4 = await contractInstance.TotalMinted.call(accounts[4])
        expect(totalMintedAccount4).to.be.bignumber.equal(web3.utils.toBN('2'));
        let totalMintedAccount5 = await contractInstance.TotalMinted.call(accounts[5])
        expect(totalMintedAccount5).to.be.bignumber.equal(web3.utils.toBN('1'));
        let totalSupply = await contractInstance.totalSupply()
        expect(totalSupply).to.be.bignumber.equal(web3.utils.toBN('10'));
    });

    it('Should succeed: transfer eth as owner', async() =>{
        const contractInstance = await nftContract.deployed();

        const initBalanceOfAccount0 = await web3.eth.getBalance(accounts[0]);
        const initBalanceOfBsbInstance = await web3.eth.getBalance(contractInstance.address);
        expect(initBalanceOfBsbInstance).to.be.bignumber.equal(web3.utils.toBN(web3.utils.toWei("0.01")));

        await contractInstance.TransferMatic({from: accounts[0]});

        const afterBalanceOfBsbInstance = await web3.eth.getBalance(contractInstance.address);
        const afterBalanceOfAccount0 = await web3.eth.getBalance(accounts[0]);
        expect(afterBalanceOfBsbInstance).to.be.bignumber.equal(web3.utils.toBN('0'));
        expect(afterBalanceOfAccount0).to.be.bignumber.greaterThan(web3.utils.toBN(initBalanceOfAccount0));
    });

    it('Should succeed: Mint all NFTs', async() =>{
        const contractInstance = await nftContract.deployed();
        try{
            let counter = 1;
            const accounts = await web3.eth.getAccounts()
            let minter = accounts[1];
            const totalSupply = await contractInstance.totalSupply.call();
            const NftsLeft = 550 - totalSupply;
            while(counter <= NftsLeft) {
                if (counter > 100 && counter <= 200) {
                    minter = accounts[2];
                } else if (counter > 200 && counter <= 300) {
                    minter = accounts[3];
                } else if (counter > 300 && counter <= 400) {
                    minter = accounts[4];
                } else if (counter > 400 && counter <= 500) {
                    minter = accounts[5];
                } else if (counter > 500) {
                    minter = accounts[6];
                }
                try {
                    await contractInstance.Mint(1, {from: minter, value: web3.utils.toWei("0.1")});
                    const totalSupply = await bsbInstance.totalSupply.call();
                    console.log(`NFT #${totalSupply.toString()} minted.`);
                } catch (error) {
                    console.log(error);
                }
                counter++;
            }
        }
        catch(err){
            assert.include(err.message, "Cannot mint more than allowed", "The error message should contain 'Cannot mint more than allowed'");
        }
    });

    it('should fail: try to mint when all tokens have been minted', async() =>{
        const contractInstance = await nftContract.deployed();
        try{
            await contractInstance.Mint(1, {from: accounts[5], value: web3.utils.toWei("0.1")});
            await contractInstance.Mint(1, {from: accounts[6], value: web3.utils.toWei("0.1")});
            assert.fail("The transaction should have thrown an error");
        }
        catch(err){
            assert.include(err.message, "All tokens have been minted", "The error message should contain 'All tokens have been minted'");
        }
    });
});