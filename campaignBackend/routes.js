const express = require("express");
const router = express.Router();
var web3 = require("./util").web3;
var registryInstance = require("./util").registryInstance;
var promisify = require("./util").promisify;
var signTransaction = require("./util").signTransaction;
var RegistryAddress = require("./util").RegistryAddress;
var addToIPFS = require("./IPFS").addToIPFS;
privateKey= "97bad0e89b4f26456b6880c650475954bf6a0a1b01690ce63637507d7caf9165";
gasPrice=1500000000;
gasLimit=1133697;

router.get("/", (req, res) => {
    res.send("welcome to election season");
});


router.post("/candidate",(req, res)=>{
  var publicAddress = String(req.body.publicAddress);
  var candidateName = String(req.body.name);
  var candidateInfo = String(req.body.info);
  var candidatesAge = String(req.body.age);
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
      console.log("hi")
      console.log(transactionHash)
      res.send(transactionHash)
      web3.eth.getTransactionReceiptMined(transactionHash).then((receipt)=>{
        console.log(receipt)
      })

    });
  });
})

router.post("/contributor",(req, res)=>{
  var publicAddress = String(req.body.publicAddress);
  var contributorName = String(req.body.name);
  var contributorInfo = String(req.body.info);
  var contributorAge = String(req.body.age);
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
      console.log("hi")
      console.log(transactionHash)
      res.send(transactionHash)
      web3.eth.getTransactionReceiptMined(transactionHash).then((receipt)=>{
        console.log(receipt)
      })

    });
  });


})


router.post("/payee",(req, res)=>{
  var publicAddress = String(req.body.publicAddress);
  var payeeName = String(req.body.name);
  var payeeInfo = String(req.body.info);
  var payeeAge = String(req.body.age);
  var obj = {
    public_Address: publicAddress,
    payee_Name: payeeName,
    payee_Info: payeeInfo,
    payee_Age: payeeAge
  }
  addToIPFS(obj,(ipfsHash)=>{
    var callData = registryInstance.addPayee.getData(publicAddress,payeeName,ipfsHash)
    var serializedTx = signTransaction(callData,privateKey,gasPrice,gasLimit,RegistryAddress)
    web3.eth.sendRawTransaction(serializedTx, (error,transactionHash)=>{
      console.log("hi")
      console.log(transactionHash)
      res.send(transactionHash)
      web3.eth.getTransactionReceiptMined(transactionHash).then((receipt)=>{
        console.log(receipt)
      })
    });
  });

})

web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
    var transactionReceiptAsync;
    interval = interval ? interval : 500;
    transactionReceiptAsync = function(txnHash, resolve, reject) {
        try {
            var receipt = web3.eth.getTransactionReceipt(txnHash);
            if (receipt == null) {
                setTimeout(function () {
                    transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
            } else {
                resolve(receipt);
            }
        } catch(e) {
            reject(e);
        }
    };

    if (Array.isArray(txnHash)) {
        var promises = [];
        txnHash.forEach(function (oneTxHash) {
            promises.push(web3.eth.getTransactionReceiptMined(oneTxHash, interval));
        });
        return Promise.all(promises);
    } else {
        return new Promise(function (resolve, reject) {
                transactionReceiptAsync(txnHash, resolve, reject);
            });
    }
};

module.exports = router;
