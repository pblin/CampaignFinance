const express = require("express");
const router = express.Router();
var web3 = require("./util").web3;
var registryInstance = require("./util").registryInstance;
var promisify = require("./util").promisify;
var signTransaction = require("./util").signTransaction;
var RegistryAddress = require("./util").RegistryAddress;
var addToIPFS = require("./IPFS").addToIPFS;
privateKey= "3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266";
gasPrice=1;
gasLimit=100000;

router.get("/", (req, res) => {
    res.send("welcome to election season");
});


router.post("/candidate",(req, res)=>{
  var publicAddress = req.body.publicAddress;
  var candidateName = req.body.name;
  var candidateInfo = req.body.info;
  var candidatesAge = req.body.age;
  var obj = {
    public_Address: publicAddress,
    candidate_Name: candidateName,
    candidate_Info: candidateInfo,
    candidates_Age: candidatesAge
  }
  addToIPFS(obj,(ipfsHash)=>{
    var callData = registryInstance.addCandidate.getData(publicAddress,candidateName,ipfsHash)
    var serializedTx = signTransaction(callData,privateKey,gasPrice,gasLimit,RegistryAddress)
    web3.eth.sendRawTransaction(serializedTx, (error,transactionHash)=>{
      res.send(transactionHash)
    });
  });
})

router.post("/contributor",(req, res)=>{
  var publicAddress = req.body.publicAddress;
  var contributorName = req.body.name;
  var contributorInfo = req.body.info;
  var contributorAge = req.body.age;
  var obj = {
    public_Address: publicAddress,
    contributor_Name: contributorName,
    contributor_Info: contributorInfo,
    contributor_Age: contributorAge
  }
  addToIPFS(obj,(ipfsHash)=>{
    var callData = registryInstance.addContributor.getData(publicAddress,contributorName,ipfsHash)
    var serializedTx = signTransaction(callData,privateKey,gasPrice,gasLimit,RegistryAddress)
    web3.eth.sendRawTransaction(serializedTx, (error,transactionHash)=>{
      res.send(transactionHash)
    });
  });


})




module.exports = router;
