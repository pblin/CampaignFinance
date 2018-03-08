const fs = require("fs");
const solc = require("solc");
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const ZeroClientProvider = require('web3-provider-engine/zero.js')

//const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/Pd3j9YfH7kWLXAS7Sayq"));
const web3 = new Web3(
    ZeroClientProvider({
      static: {
        eth_syncing: false,
        web3_clientVersion: 'ZeroClientProvider',
      },
      pollingInterval: 99999999, // not interested in polling for new blocks
      rpcUrl: 'https://ropsten.infura.io/Pd3j9YfH7kWLXAS7Sayq',
      // account mgmt
      getAccounts: (cb) => cb(null, [])
    })
  );

const owner = "0xA7057B9ECc62B4c8920eB993Ae8CB08f3Bd472f2";

const RegistryAddress = "0xa3ccf7a0aabf7eb438dad028001f08f6bf066e1c";

//when sending transactions check that address is valid
/*
 If you pass in an undefined object and an amount in the sendTransaction function and your user signs the transaction,
 a new contract will be created and ether will be sent to that contract.
 Opps sorry you trusted my interface and now your ether went somewhere you didn’t intend it to.
*/

function contractBuilder (_contractFile, _deployedAddress,_contractName){
  /*create contract instance
  @_contractFile = path to the solidity source file
  @_deployedAddress= the addres at which the the contract is deployed
  @_contractName = the name of the contract
  */
  //perhaps we can just pass in abi instead of compiling on the fly

  let source = fs.readFileSync(_contractFile, 'utf8');
  const compliedFile = solc.compile(source.toString(), 1);
  const abi = JSON.parse(compliedFile.contracts[_contractName].interface);
  var contract = web3.eth.contract(abi);
  //**** check that the adddress is valid
  var contractInstance = contract.at(_deployedAddress);
  return contractInstance;
}

web3.eth.getTransactionReceiptMined = function getTransactionReceiptMined(txHash, interval) {
    const self = this;
    const transactionReceiptAsync = function(resolve, reject) {
        self.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else if (receipt == null) {
                setTimeout(
                    () => transactionReceiptAsync(resolve, reject),
                    interval ? interval : 500);
            } else {
                resolve(receipt);
            }
        });
    };

    if (Array.isArray(txHash)) {
        return Promise.all(txHash.map(
            oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
    } else if (typeof txHash === "string") {
        return new Promise(transactionReceiptAsync);
    } else {
        throw new Error("Invalid Type: " + txHash);
    }
};


function signTransaction(_callData,_privateKey,_gasPrice,_gasLimit,_to, callback){
  var privateKey = new Buffer(_privateKey, 'hex')
  var nonce = web3.eth.getTransactionCount(owner, 'pending');
  console.log(nonce);
  var nonceHex = web3.toHex(nonce);
  var rawTx = {
    nonce: nonceHex,
    gasPrice: _gasPrice,
    gasLimit: _gasLimit ,
    to: _to,
    data: _callData
  }
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = tx.serialize();
  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), callback);
}


function Registry(_contractInstance){

  var to = _contractInstance.address

  this.isPayee = _contractInstance.isPayee
  this.isContributor = _contractInstance.isContributor
  this.getPayeeData = _contractInstance.getPayeeData
  this.getPayeeData = _contractInstance.getPayeeData
  this.getContributorData = _contractInstance.getContributorData
  this.getCandidateData = _contractInstance.getCandidateData
  this.getCampaignData = _contractInstance.getCampaignData

  /*
  only owneronly set functions
  */
  this.addPayee = function(_payee, _dataLocation,_privateKey, _gasPrice, _gasLimit,callback){
    var callData = _contractInstance.addPayee.getData(_payee,_dataLocation);
    signTransaction(callData, _privateKey, _gasPrice, _gasLimit, to, callback);
  }

  this.addContributor = function(_contributor, _dataLocation,_privateKey, _gasPrice, _gasLimit, callback){
    var callData = _contractInstance.addContributor.getData(_contributor, _dataLocation);
    signTransaction(callData, _privateKey, _gasPrice, _gasLimit, to, callback);
  }

  this.addCampaignID = function(_campaignID,_creater,_dataLocation, _privateKey, _gasPrice, _gasLimit,callback){
    var callData = _contractInstance.addCampaignID.getData(_campaignID,_creater,_dataLocation);
    signTransaction(callData, _privateKey, _gasPrice, _gasLimit, to, callback);
  }

  this.addCandidate = function(_candidate, _dataLocation, _privateKey, _gasPrice, _gasLimit, callback){
    var callData = _contractInstance.addCandidate.getData(_candidate, _dataLocation);
    signTransaction(callData, _privateKey, _gasPrice, _gasLimit, to, callback);
  }

}



function eventHandler (_contractInstance,_event,_allEvents=false, topics={},filter = {}){
  /*_event could be string or string array
  generic events prototype
  */
  if (_allEvents){
    return _contractInstance.allEvents(topics,filter);
  }
  else {
    return _contractInstance[_event](topics,filter);
  }
}



module.exports = {
    RegistryAddress,
    contractBuilder,
    Registry,
    web3,
    eventHandler
}
