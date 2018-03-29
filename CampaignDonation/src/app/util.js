
const Web3 = require('web3');

const RegistryABI = [{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"getPayeeData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_contributor","type":"address"}],"name":"isContributor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_candidate","type":"address"}],"name":"getCandidateData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"isPayee","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_candidate","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignLogo","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_campaignID","type":"address"},{"name":"_creater","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"},{"name":"_logo","type":"bytes32"}],"name":"addCampaignID","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getListOfCampaign","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_payee","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addPayee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_contributor","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addContributor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_contributor","type":"address"}],"name":"getContributorData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payee","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"PayeeAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"contributorAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"campaign","type":"address"},{"indexed":false,"name":"creater","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"CampaignAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"candidate","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"CandidateAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]

const CampaignFundABI = [{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"signTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"contribute","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"pay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPendingTransactions","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getFundBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_maxDonation","type":"uint256"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"},{"name":"_logo","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"ownerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"deletedOwner","type":"address"}],"name":"ownerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"reciever","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"Contribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"campagin","type":"address"},{"indexed":false,"name":"reciever","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"transactionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"transactionId","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"TransactionCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"by","type":"address"},{"indexed":false,"name":"transactionId","type":"uint256"}],"name":"TransactionSigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]



const ERC223ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_initialAmount","type":"uint256"},{"name":"_tokenName","type":"string"},{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenSymbol","type":"string"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]


const RegistryAddress ="0x3d8d58439e1943d770d037ae52136df5ebd11662";
const ERC223Address="0xad891f815ce5e4e7be832b2cccd63da86a5c436b";



const bs58= require('bs58');

function getBytes32FromIpfsHash(ipfsListing) {
  return "0x"+bs58.decode(ipfsListing).slice(2).toString('hex')
}
function getIpfsHashFromBytes32(bytes32Hex) {
  const hashHex = "1220" + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex');
  const hashStr = bs58.encode(hashBytes)
  return hashStr
}


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



if (typeof window.web3 === 'undefined') {
  var metaMaskWeb3=new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/Pd3j9YfH7kWLXAS7Sayq"));
}else{
  var metaMaskWeb3 = new Web3(window.web3.currentProvider);
  metaMaskWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

}
var infuraWeb3=new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/Pd3j9YfH7kWLXAS7Sayq"));

var metaMaskRegistryInst =metaMaskWeb3.eth.contract(RegistryABI).at(RegistryAddress)


const ZeroClientProvider = require('web3-provider-engine/zero.js')
const ZeroWeb3 = new Web3(
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

function eventHandler (_contractInstance,_event,_allEvents=false, filter = {}){
    /*_event could be string or string array
    generic events prototype
    */
    if (_allEvents){
      return _contractInstance.allEvents({},filter);
    }
    else {
      return _contractInstance[_event]({},filter);
    }
  }

module.exports={
  RegistryABI,
  RegistryAddress,
  CampaignFundABI,
  ERC223Address,
  ERC223ABI,
  promisify,
  getBytes32FromIpfsHash,
  getIpfsHashFromBytes32,
  metaMaskWeb3,
  infuraWeb3,
  metaMaskRegistryInst,
  ZeroWeb3,
  eventHandler
}
