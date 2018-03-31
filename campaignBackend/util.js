const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/Pd3j9YfH7kWLXAS7Sayq"));
const Tx = require('ethereumjs-tx');


const owner = "0x670C7F3FB5c61B68438624E8F00077f782FFf9D8";


function signTransaction(_callData,_privateKey,_gasPrice,_gasLimit,_to){
  var privateKey = new Buffer(_privateKey, 'hex')
  var nonce = web3.eth.getTransactionCount(owner, 'pending');
  var nonceHex = web3.toHex(nonce);
  console.log(nonce)
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
  return '0x' + serializedTx.toString('hex')
}


const RegistryABI = [{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"getPayeeData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_contributor","type":"address"}],"name":"isContributor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_candidate","type":"address"}],"name":"getCandidateData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"isPayee","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_candidate","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignLogo","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_campaignID","type":"address"},{"name":"_creater","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"},{"name":"_logo","type":"bytes32"}],"name":"addCampaignID","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getListOfCampaign","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_payee","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addPayee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_contributor","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addContributor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_contributor","type":"address"}],"name":"getContributorData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payee","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"PayeeAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"contributorAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"campaign","type":"address"},{"indexed":false,"name":"creater","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"CampaignAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"candidate","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"CandidateAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]


const RegistryAddress ="0x3d8d58439e1943d770d037ae52136df5ebd11662";

const registryInstance = web3.eth.contract(RegistryABI).at(RegistryAddress)
const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res);
            }
        })
    );



module.exports={
    web3,
    RegistryABI,
    RegistryAddress,
    registryInstance,
    promisify,
    signTransaction
}
