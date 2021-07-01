var account;

window.addEventListener("load", async () => {
    if(window.ethereum !== undefined) {
        let accounts = await ethereum.request({method: 'eth_requestAccounts'});
        account = accounts[0];
        document.querySelector("[name='account']").value = account;
    }
})

ethereum.on('accountsChanged', accounts => {
    account = accounts[0];
    document.querySelector("[name='account']").value = account;
})

// const transaction = (tokenId) => {
//     let url = `/estate/${tokenId}`
//     fetch(url, {
//         method: "POST",
//         body: JSON.stringify({
//             address: account
//         })
//     })
//     .then(res => res.json())
//     .then(res => {console.log(res.transaction)})
//     .catch(err => {console.log(err)})
// }

// document.querySelector('.btn').addEventListener("click", () => {
//     let url = `/estate/${this.id}`
//     fetch(url, {
//         method: "POST",
//         body: JSON.stringify({
//             address: account
//         })
//     })
//     .then(res => res.json())
//     .then(res => {console.log(res.transaction)})
//     .catch(err => {console.log(err)})
// })



