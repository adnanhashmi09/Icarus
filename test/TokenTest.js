const EstateToken = artifacts.require("EstateToken");

contract("EstateTokenTest", (accounts) => {
    let [user1, user2] = accounts;
    let contractInstance;
    console.log(user1, user2);

    beforeEach(async () => {
        contractInstance = await EstateToken.new();
    })

    xcontext("Mint tests", async () => {
        it("Token Mint Test", async () => {
            await contractInstance.mint(user1, "QmTEgKvzbGdHyRhnS7ijuUnKAfEGir2vvi1KZUPsJF7ywp", "ipfs://QmR417Pep5sja9RUg9r8GyxEbeYtsjojKHJEDb38kS8pkq", {from: user1});
            await contractInstance.mint(user2, "QmTEgKvzbGdHyRhnS7ijuUnKdfEGir2vvi1KZUPsJF7ywp", "ipfs://QmR417Pep5sja9RUg9r8GyxdfeYtsjojKHJEDb38kS8pkq", {from: user2});
            var res = await contractInstance.getID("QmTEgKvzbGdHyRhnS7ijuUnKdfEGir2vvi1KZUPsJF7ywp", {from: user2});
            var owner = await contractInstance.ownerOf(res.words[0]);
            console.log(owner);
        })
    })

    context("Fractions test", async () => {
        it("minting fractions", async () => {
            await contractInstance.mint(user1, "QmTEgKvzbGdHyRhnS7ijuUnKAfEGir2vvi1rZUPsJF7ywp", "ipfs://QmR417Pep5wja9RUg9r8GyxEbeYtsjojKHJEDb38kS8pkq", {from: user1});
            var tokenID = await contractInstance.getId();
            await contractInstance.setTokenFractions(tokenID, 1000, 100);
            await contractInstance.tranferTokens(user1, user2, tokenID, 10, 20, {from: user1});
            await contractInstance.tranferTokens(user2, user1, tokenID, 5, 10, {from: user2});
            var user1_balance = await contractInstance.getUserBalance(user1, tokenID);
            console.log(user1_balance);
            var user2_balance = await contractInstance.getUserBalance(user2, tokenID);
            console.log(user2_balance);
        })
    })

})
