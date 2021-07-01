const Web3 = require('web3');
const fs = require('fs');

const estate_abi = require('../../../build/contracts/EstateToken.json')
const tokens_abi = require('../../../build/contracts/cERC20.json');

//EstateToken contract address
const ContractAddress = "";

const web3 = new Web3('http://localhost:8545');

const contract = new web3.eth.Contract(estate_abi.abi, ContractAddress);

const mintTokens = async (user, ipfs_hash, tokenURI) => {
    try {
        let res = await contract.methods.mint(user, ipfs_hash, tokenURI).send({from: user, gas: 200000});
        console.log('ERC721 minting complete');
    } catch(err) {
        console.log(err);
    }

    let tokenId = await contract.methods.getId().call();
    return tokenId;
}

const getNFTOwner = async tokenId => {
    let owner = await contract.methods.getOwner(tokenId).call();
    return owner;
}

const connectContract = tokenId => {
    let tokenAddress = contract.methods.getContract(tokenId).call();
    let tokenContract = new web3.eth.Contract(tokens_abi.abi, tokenAddress);
    return tokenContract;
}

const mintFractions = async tokenId => {
    
    let tokenContract = new web3.eth.Contract(tokens_abi.abi);
    
    try {
        let newContract = await tokenContract.deploy({data: tokens_abi.bytecode, arguments: [tokenId, 'name', 'FRCT']}).send({from: user, gas: 3000000});
        console.log('Contract created');

        try { 
            await contract.methods.setTokenFractions(tokenId, newContract._address).send({from: user});
            await newContract.methods._mint(user, amount, price, newContract._address).send({from: user, gas: 200000});

            console.log(`Tokens minting complete: ${tokenId}`);

        } catch(err) {
            console.log(err);
        }

    } catch(err) {
        console.log(err);
    }

}

const TransferTokens = async (recipient, tokenId, amount) => {
    
    let tokenContract = connectContract(tokenId);
    let sender = getNFTOwner(tokenId);

    try {
        let price = await tokenContract.methods.Price().call();
        let cost = price*amount;

        await tokenContract.methods.requestTransfer(sender, recipient, amount, price).send({from: recipient, value: web3.utils.toWei(cost.toString(), 'ether')});
        
        console.log("--Transaction Success--");

    }  catch(err) {
        console.log(err);
    }

}

const getTokenDetails = async tokenId => {
   
    let tokenContract = connectContract(tokenId);
    
    try {
        let res = await tokenContract.methods.tokenDetails().call();
        console.log(res);
    } catch(err) {
        console.log(err);
    }
}

const mintComplete = async (user, ipfs_hash, tokenURI) => {
    
    try {
        let tokenId = await mintTokens(user, ipfs_hash, tokenURI);
        await mintFractions(tokenId);

    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    mintTokens, 
    mintFractions,
    mintComplete,
    TransferTokens,
    getTokenDetails
}