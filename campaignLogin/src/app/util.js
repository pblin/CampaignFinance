
const Web3 = require('web3');

const RegistryABI = [{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"getPayeeData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_contributor","type":"address"}],"name":"isContributor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_candidate","type":"address"}],"name":"getCandidateData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"isPayee","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_candidate","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignLogo","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_campaignID","type":"address"},{"name":"_creater","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"},{"name":"_logo","type":"bytes32"}],"name":"addCampaignID","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getListOfCampaign","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_payee","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addPayee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_contributor","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addContributor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_contributor","type":"address"}],"name":"getContributorData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payee","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"PayeeAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"contributorAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"campaign","type":"address"},{"indexed":false,"name":"creater","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"CampaignAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"candidate","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"CandidateAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]




const CampaignFundABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"_transactions","outputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"},{"name":"signatureCount","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getPendingTransactionDetail","outputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"signTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"_pendingTransactions","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"contribute","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"pay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPendingTransactions","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getFundBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_maxDonation","type":"uint256"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"},{"name":"_logo","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"ownerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"deletedOwner","type":"address"}],"name":"ownerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"reciever","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"Contribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"campagin","type":"address"},{"indexed":false,"name":"reciever","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"transactionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"transactionId","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"TransactionCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"by","type":"address"},{"indexed":false,"name":"transactionId","type":"uint256"}],"name":"TransactionSigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]



const ERC223ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_initialAmount","type":"uint256"},{"name":"_tokenName","type":"string"},{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenSymbol","type":"string"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]


const RegistryAddress ="0x0c0bf41040ce0e6a014527eb3993bad86227fcf1";
const ERC223Address="0x1b880a3ce1f44a5ebfb29b9a11fdaff5e0ef3e0d";


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
  var metaMaskWeb3=new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/Pd3j9YfH7kWLXAS7Sayq"));
}else{
  var metaMaskWeb3 = new Web3(window.web3.currentProvider);
  metaMaskWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

}
var infuraWeb3=new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/Pd3j9YfH7kWLXAS7Sayq"));

var metaMaskRegistryInst =metaMaskWeb3.eth.contract(RegistryABI).at(RegistryAddress)


const ZeroClientProvider = require('web3-provider-engine/zero.js')
const ZeroWeb3 = new Web3(
    ZeroClientProvider({
      static: {
        eth_syncing: false,
        web3_clientVersion: 'ZeroClientProvider',
      },
      pollingInterval: 99999999, // not interested in polling for new blocks
      rpcUrl: 'https://rinkeby.infura.io/Pd3j9YfH7kWLXAS7Sayq',
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




var campaignFundByteCode =
"6060604052341561000f57600080fd5b604051608080610e548339810160405280805191906020018051919060200180519190602001805160008054600160a060020a0333818116600160a060020a031993841617909355600780548316730c0bf41040ce0e6a014527eb3993bad86227fcf1179081905560058054909316731b880a3ce1f44a5ebfb29b9a11fdaff5e0ef3e0d179092559294509091169150636bf9b5639030908686866040517c010000000000000000000000000000000000000000000000000000000063ffffffff8816028152600160a060020a03958616600482015293909416602484015260448301919091526064820152608481019190915260a401600060405180830381600087803b151561011f57600080fd5b5af1151561012c57600080fd5b505050600693909355505050610d0d806101476000396000f3006060604052600436106100ab5763ffffffff60e060020a6000350416630b92880e81146100b05780630f934ce7146100fd578063173825d9146101405780633b66d02b146101615780635d9ec210146101835780637065cb48146101995780638da5cb5b146101b8578063b58a5066146101e7578063c1cbbca71461020f578063c407687614610225578063d11db83f14610247578063dae9e379146102ad578063f2fde38b146102c0575b600080fd5b34156100bb57600080fd5b6100c66004356102df565b604051600160a060020a03948516815292909316602083015260408083019190915260ff9092166060820152608001905180910390f35b341561010857600080fd5b610113600435610318565b604051600160a060020a039384168152919092166020820152604080820192909252606001905180910390f35b341561014b57600080fd5b61015f600160a060020a0360043516610348565b005b341561016c57600080fd5b61015f600160a060020a03600435166024356103c5565b341561018e57600080fd5b61015f6004356104c5565b34156101a457600080fd5b61015f600160a060020a03600435166106ec565b34156101c357600080fd5b6101cb61076e565b604051600160a060020a03909116815260200160405180910390f35b34156101f257600080fd5b6101fd60043561077d565b60405190815260200160405180910390f35b341561021a57600080fd5b61015f60043561079c565b341561023057600080fd5b61015f600160a060020a0360043516602435610904565b341561025257600080fd5b61025a610ae3565b60405160208082528190810183818151815260200191508051906020019060200280838360005b83811015610299578082015183820152602001610281565b505050509050019250505060405180910390f35b34156102b857600080fd5b6101fd610b42565b34156102cb57600080fd5b61015f600160a060020a0360043516610bb0565b60026020819052600091825260409091208054600182015492820154600390920154600160a060020a0391821693909116919060ff1684565b6000908152600260208190526040909120805460018201549190920154600160a060020a03928316939290911691565b60005433600160a060020a0390811691161461036357600080fd5b60008054600160a060020a031681526001602052604090819020805460ff191690557f839c3949c3979499299683cc9d04485ea754bc389b14e057e2af661178985b0290829051600160a060020a03909116815260200160405180910390a150565b600754600160a060020a0316631d0d35f58360405160e060020a63ffffffff8416028152600160a060020a039091166004820152602401602060405180830381600087803b151561041557600080fd5b5af1151561042257600080fd5b50505060405180519050151561043757600080fd5b600654600160a060020a03831660009081526008602052604090205461045d9083610c4b565b111561046857600080fd5b7f11baae84482529971e9b18621a3796eb326881be9fc3e10c27f2ef760d8bc65182308342604051600160a060020a0394851681529290931660208301526040808301919091526060820192909252608001905180910390a15050565b6000805433600160a060020a03908116911614806104ff5750600160a060020a03331660009081526001602081905260409091205460ff16145b151561050a57600080fd5b5060008181526002602052604090208054600160a060020a0316151561052f57600080fd5b600160a060020a033316600090815260048201602052604090205460ff166001141561055a57600080fd5b33600160a060020a0381166000908152600483016020526040908190208054600160ff19918216811790925560038501805491821660ff9283169093019091169190911790557fac63e7e1dc16bccf900879686e74ca33eeb175b670e3aaa9d7e4ccf3781b7a7a9190849051600160a060020a03909216825260208201526040908101905180910390a16003810154600260ff909116106106e85760055460018201546002830154600160a060020a039283169263a9059cbb92169060405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401602060405180830381600087803b151561065957600080fd5b5af1151561066657600080fd5b505050604051805150508054600182015460028301547f43c59ecbdce502816542a83d09b54203b92ea9bc92ede06e88231ccfddae73d392600160a060020a039081169216908542604051600160a060020a0395861681529390941660208401526040808401929092526060830152608082019290925260a001905180910390a15b5050565b60005433600160a060020a0390811691161461070757600080fd5b60008054600160a060020a0316815260016020819052604091829020805460ff191690911790557ff384ffe7ff07c73bc1e2feccdbd24caca828c137bb17e89da2a3b7186cd5f63f90829051600160a060020a03909116815260200160405180910390a150565b600054600160a060020a031681565b600380548290811061078b57fe5b600091825260209091200154905081565b600654600160a060020a0333166000908152600860205260409020546107c29083610c4b565b11156107cd57600080fd5b600754600160a060020a0316631d0d35f53360405160e060020a63ffffffff8416028152600160a060020a039091166004820152602401602060405180830381600087803b151561081d57600080fd5b5af1151561082a57600080fd5b50505060405180519050151561083f57600080fd5b600160a060020a0333166000908152600860205260409020546108629082610c4b565b33600160a060020a03818116600090815260086020526040908190209390935560055416916323b872dd9190309085905160e060020a63ffffffff8616028152600160a060020a0393841660048201529190921660248201526044810191909152606401602060405180830381600087803b15156108df57600080fd5b5af115156108ec57600080fd5b50505060405180519050151561090157600080fd5b50565b600061090e610c61565b60005433600160a060020a0390811691161461092957600080fd5b600754600160a060020a031663366653a98560405160e060020a63ffffffff8416028152600160a060020a039091166004820152602401602060405180830381600087803b151561097957600080fd5b5af1151561098657600080fd5b50505060405180519050151561099b57600080fd5b6004805460018101909155600160a060020a033081168352851660208084019190915260408084018690526000606085018190528381526002909252902090925081908151815473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0391909116178155602082015160018201805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03929092169190911790556040820151816002015560608201516003918201805460ff191660ff92909216919091179055805490915060018101610a758382610c88565b5060009182526020909120018290557fc5094f20ddbb9bda2b4d1b39f78d7d784f323b721a2a8f32456a45d3dfb716d830858542604051600160a060020a0394851681529290931660208301526040808301919091526060820192909252608001905180910390a150505050565b610aeb610cb1565b6003805480602002602001604051908101604052809291908181526020018280548015610b3757602002820191906000526020600020905b815481526020019060010190808311610b23575b505050505090505b90565b600554600090600160a060020a03166370a082313060405160e060020a63ffffffff8416028152600160a060020a039091166004820152602401602060405180830381600087803b1515610b9557600080fd5b5af11515610ba257600080fd5b505050604051805191505090565b60005433600160a060020a03908116911614610bcb57600080fd5b600160a060020a0381161515610be057600080fd5b600054600160a060020a0380831691167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a36000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b600082820183811015610c5a57fe5b9392505050565b60806040519081016040908152600080835260208301819052908201819052606082015290565b815481835581811511610cac57600083815260209020610cac918101908301610cc3565b505050565b60206040519081016040526000815290565b610b3f91905b80821115610cdd5760008155600101610cc9565b50905600a165627a7a723058203d5a9e9db25046741152c4900b07af3d12653a3a98f5e9581df20cddc488a5ac0029"


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
  eventHandler,
  CampaignFundABI,
  campaignFundByteCode
}
