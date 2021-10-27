// import {pinJSONToIPFS} from './pinata.js'
// require('dotenv').config();

// const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// console.log(process.env)
// console.log(alchemyKey)
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(alchemyKey);


// const contractABI = require('../Essences.json')
// const contractAddress = "0x72E8B06cD54b45FcCd48aBd247fF56194BC03a27";


// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts", //opens the metamask app
        });
        const obj = {
          status: "", 
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: err.message
        };
      }
    } else {
      return {
        address: "",
        status: ""
      };
    }
  };

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
        const addressArray = await window.ethereum.request({
            method: "eth_accounts", //connect to existing wallet
        });
        if (addressArray.length > 0) {
            return {
            address: addressArray[0],
            status: "",
            };
        } else {
            return {
            address: "",
            status: "",
            };
        }
        } catch (err) {
        return {
            address: "",
            status: err.message,
        };
        }
    } else {
        return {
        address: "",
        status: "",
        };
    }
};        

// export const waitTx = async(txHash) => {
//   let transactionReceipt = null
//   while (transactionReceipt == null) {
//             transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
//             await sleep(5)
//         }
//   return
// }

// export const mintNFT = async(count) => {

//     //error handling
//     // if (url.trim() == "" || (name.trim() == "" || description.trim() == "")) { 
//     //     return {
//     //         success: false,
//     //         status: "❗Please make sure all fields are completed before minting.",
//     //     }
//     // }

//     //make metadata
//     // const metadata = new Object();
//     // metadata.name = name;
//     // metadata.image = url;
//     // metadata.description = description;

//     //pinata pin request
//     // const pinataResponse = await pinJSONToIPFS(metadata);
//     // if (!pinataResponse.success) {
//     //     return {
//     //         success: false,
//     //         status: "😢 Something went wrong while uploading your tokenURI.",
//     //     }
//     // } 
//     // const tokenURI = pinataResponse.pinataUrl;
//     // var balance = await web3.eth.getBalance(window.ethereum.selectedAddress)
//     // if (balance <= 50000000000000000) {
        
//     //     return {
//     //         success: false,
//     //         status: "Insufficient Ether"
//     //     }
//     // }

//     //load smart contract
//     window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();
    
//     //set up your Ethereum transaction
//     const transactionParameters = {
//         to: contractAddress, // Required except during contract publications.
//         from: window.ethereum.selectedAddress, // must match user's active address.
//         data: window.contract.methods.mintEssences(1).encodeABI(), //make call to NFT smart contract 
//         value: web3.utils.toHex("50000000000000000")
//     };

//     //sign transaction via Metamask
//     try {
//         const txHash = await window.ethereum
//             .request({
//                 method: 'eth_sendTransaction',
//                 params: [transactionParameters],
//             });
//         return {
//             success: true,
//             status: txHash//"✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
//         }
//     } catch (error) {
//         return {
//             success: false,
//             status: "Minting Failed"//"😥 Something went wrong: " + error.message
//         }
//     }
// }