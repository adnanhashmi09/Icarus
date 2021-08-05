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






