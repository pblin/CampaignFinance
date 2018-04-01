const ipfsAPI = require('ipfs-api');
const ipfsApi = new ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

const bs58= require('bs58');
// Return bytes32 hex string from base58 encoded ipfs hash,
// stripping leading 2 bytes from 34 byte IPFS hash
// Assume IPFS defaults: function:0x12=sha2, size:0x20=256 bits
// E.g. "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL" -->
// "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"

console.log("jill:  "+ getBytes32FromIpfsHash("Qmbp3dWAxdEB2aDNbzUhuYS3Ae8TUG8uUXuVCRAYKmyXyc"));

console.log("bernie:  " +getBytes32FromIpfsHash("QmQArixLLeWnfo8xS59hrL8cbGT5pJxnN2qkWiJYXu9TQj"));

console.log("al gore:  " + getBytes32FromIpfsHash("QmSR5vhiy3ARyBebuJi7SYuxfW8jL2x1dAjMqiZ5JvNtD9"));

console.log("kanye:  " +getBytes32FromIpfsHash("QmWQEdVYvp2W3HWFWDG4o1SDbSkMvMrHvx3y3cNvHvRqE1"));

function getBytes32FromIpfsHash(ipfsListing) {
  return "0x"+bs58.decode(ipfsListing).slice(2).toString('hex')
}

// Return base58 encoded ipfs hash from bytes32 hex string,
// E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
// --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"

function getIpfsHashFromBytes32(bytes32Hex) {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = "1220" + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex');
  const hashStr = bs58.encode(hashBytes)
  return hashStr
}

//add what ever you want to IPFS
OBJECT_TO_ADD_1={
  name : "Jill stein",
  party : "green",
  slogan : "where am i and who are all these people"
}
OBJECT_TO_ADD_2={
  name : "Bernie Sanders",
  party : "dem",
  slogan : "feel the berrrrn"
}
OBJECT_TO_ADD_3={
  name : "al gore",
  party : "rep",
  slogan : "why did i do this"
}

OBJECT_TO_ADD_4={
  name : "Kanye",
  party : "ind",
  slogan : "I am God's vessel"
}




function addToIPFS(obj){
  obj= JSON.stringify(obj)
  ipfsApi.files.add({
    content: Buffer.from(obj)
  },function(err, filesAdded){
    console.log("hex version of path is: " + filesAdded[0].path)
    console.log("converted to bytes32: " + getBytes32FromIpfsHash(filesAdded[0].path))
    var ipfsPath='/ipfs/'+filesAdded[0].path

    ipfsApi.files.cat(ipfsPath, function (err, file) {
      if (err) {
        throw err
      }

      console.log(file.toString('utf8'));
  })

  })

}

// addToIPFS(OBJECT_TO_ADD_1)
// addToIPFS(OBJECT_TO_ADD_2)
// addToIPFS(OBJECT_TO_ADD_3)
addToIPFS(OBJECT_TO_ADD_4)
