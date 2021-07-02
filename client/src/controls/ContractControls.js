const Web3 = require('web3');
const fs = require('fs');

const estate_abi = require('../../../build/contracts/EstateToken.json')
const tokens_abi = require('../../../build/contracts/cERC20.json');
const data = require('../DB/realEstate.json');
const estates = data.data;

//EstateToken contract address
const ContractAddress = "0xD2A897c91c93A2B053a18Bbdc5D483E850458220";

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

const connectContract = async tokenId => {
    let tokenAddress = await contract.methods.getContract(tokenId).call();
    let tokenContract = new web3.eth.Contract(tokens_abi.abi, tokenAddress);
    return tokenContract;
}

const mintFractions = async (tokenId, amount, price) => {
    
    let tokenContract = new web3.eth.Contract(tokens_abi.abi);
    let user = await getNFTOwner(tokenId);
    let newPrice = price*10;
    
    try {
        let newContract = await tokenContract.deploy({data: tokens_abi.bytecode, arguments: [tokenId, 'name', 'FRCT']}).send({from: user, gas: 3000000});
        console.log('Contract created');

        try { 
            await contract.methods.setTokenFractions(tokenId, newContract._address).send({from: user});

            await newContract.methods._mint(user, amount, newPrice, newContract._address).send({from: user, gas: 200000});

            console.log(`Tokens minting complete: ${tokenId}`);

        } catch(err) {
            console.log(err);
        }

    } catch(err) {
        console.log(err);
    }

}

const TransferTokens = async (recipient, tokenId, amount) => {
    
    let tokenContract = await connectContract(tokenId);
    let sender = await getNFTOwner(tokenId);
    let price = await tokenContract.methods.Price().call();

    try {
        let cost = (price*amount)/10;
        await tokenContract.methods.requestTransfer(sender, recipient, amount, price).send({from: recipient, value: web3.utils.toWei(cost.toString(), 'ether')});
        console.log("--Transaction Success--");
    }  catch(err) {
        console.log(err);
    }

}

const getTokenDetails = async tokenId => {
   
    let tokenContract = await connectContract(tokenId);
    
    try {
        let res = await tokenContract.methods.tokenDetails().call();
        return res;
    } catch(err) {
        console.log(err);
    }
}

const mintComplete = async (user, ipfs_hash, tokenURI, amount, price) => {
    
    let tokenId = await mintTokens(user, ipfs_hash, tokenURI);
    try {
        await mintFractions(tokenId, amount, price);
    } catch(err) {
        console.log(err);
    }
}

const mintEstates = async () => {
    
    let accounts = await web3.eth.getAccounts();

    for(let i=0; i<estates.length; i++) {
        await mintComplete(accounts[i], estates[i].ipfs_hash, estates[i].tokenURI, estates[i]["total-tokens"], estates[i]["token-price"]);
        console.log(`${i} was success`);
    }

}

module.exports = {
    mintTokens, 
    mintFractions,
    mintComplete,
    TransferTokens,
    getTokenDetails
}