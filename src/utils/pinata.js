require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;
// const axios = require('axios');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(key, secret);

// export const pinJSONToIPFS = async(JSONBody) => {
//     const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
//     //making axios POST request to Pinata ⬇️
//     return axios 
//         .post(url, JSONBody, {
//             headers: {
//                 pinata_api_key: key,
//                 pinata_secret_api_key: secret,
//             }
//         })
//         .then(function (response) {
//            return {
//                success: true,
//                pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
//            };
//         })
//         .catch(function (error) {
//             console.log(error)
//             return {
//                 success: false,
//                 message: error.message,
//             }

//     });
// };

export const createMetadata = (algo, name, url, seed) => {
    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = "1 of 1, " + algo + ", " + seed;
    metadata.attributes = [{"trait_type": "Algorithm", "value": algo}]
    return metadata
}

// export const uploadMetadata = async(metadata) => {
//     const pinataResponse = await pinJSONToIPFS(metadata);
//     if (!pinataResponse.success) {
//         return {
//             success: false,
//             status: "error",
//         }
//     } 
//     const tokenURI = pinataResponse.pinataUrl;
//     return tokenURI
// }

export const uploadMetadata = async(metadata, options) => {
    var result = await pinata.pinJSONToIPFS(metadata, options)

    return result
}

// export const uploadFile = async(file, options) => {
    
//     // const readableStreamForFile = fs.createReadStream(file);
//     var result = await pinata.pinFileToIPFS(file, options);
//     return result
// }

export const uploadFile = (file, options) => {
    
    // const readableStreamForFile = fs.createReadStream(file);
    var result = pinata.pinFileToIPFS(file, options);
    return result
}
