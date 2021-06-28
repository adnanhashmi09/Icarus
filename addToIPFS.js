const axios = require("axios");

const pinataAPIkey = "6eb70757d1ad841da92d";
const pinataAPIsecret = "21c40224ef63258190d5a20b76bca6fd5390fb9545275f3ca1e24f411de5f69c";

const PinJSONToIPFS = async (pinataKey, pinataSecret, JSONbody) => {
    var url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    try {
        let res = await axios.post(url, JSONbody, {
                headers: {
                    pinata_api_key: pinataKey,
                    pinata_secret_api_key: pinataSecret
                }
            });
        return res.data;
    } catch(err) {
        console.log(error);
    }
}

const pinNFTToIPFS = async (TokenName, TokenDescripton) => {

    // var EstateJSON = {
    //     pinataMetadata: {
    //         name: 'Estate Token'
    //     },
    //     pinataContent: {
    //         EstateName: 'Ansal Esencia Plot',
    //         Address: 'C-1261 Ansal Esencia Sector-67',
    //         State: 'Haryana',
    //         PinCode: '122102',
    //         ListerName: 'Mehul Gulati'
    //     }
    // };

    var ipfs_hash = null;
    try {
        var res = await PinJSONToIPFS(pinataAPIkey,pinataAPIsecret,EstateJSON);
        console.log(res);
        ipfs_hash = "ipfs://" + res.IpfsHash;
    } catch(err) {
        console.log(err);
    }

    // var JSONmetadata = {
    //     pinataMetadata: {
    //         name: 'TokenMetadata'
    //     },
    //     pinataContent: {
    //         name: TokenName,
    //         description: TokenDescripton,
    //         TokenURI: ipfs_hash,
    //     }
    // };

    try {
        var res = await PinJSONToIPFS(pinataAPIkey,pinataAPIsecret,JSONmetadata);
        console.log(res);
    } catch(err) {
        console.log(err);
    }
}
