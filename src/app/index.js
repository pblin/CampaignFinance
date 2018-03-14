var React = require("react");
var ReactDom = require("react-dom");
const ipfsAPI = require('ipfs-api');
const ipfsApi = new ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

import {BrowserRouter,HashRouter,Route,Link} from 'react-router-dom';

const RegistryABI = [{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"getPayeeData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_contributor","type":"address"}],"name":"isContributor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_candidate","type":"address"}],"name":"getCandidateData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_payee","type":"address"}],"name":"isPayee","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_candidate","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignLogo","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_campaignID","type":"address"},{"name":"_creater","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"},{"name":"_logo","type":"bytes32"}],"name":"addCampaignID","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getListOfCampaign","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_payee","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addPayee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_contributor","type":"address"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"}],"name":"addContributor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_contributor","type":"address"}],"name":"getContributorData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_campaignName","type":"bytes32"}],"name":"getCampaignData","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payee","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"PayeeAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"contributorAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"campaign","type":"address"},{"indexed":false,"name":"creater","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"CampaignAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"candidate","type":"address"},{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"ipfs","type":"bytes32"}],"name":"CandidateAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]
const RegistryAddress ="0xd8c87b36c560a1166209494b40750ee7feadf217";

const Web3 = require('web3');

const CampaignFundABI = [{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"signTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"contribute","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"pay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPendingTransactions","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getFundBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_maxDonation","type":"uint256"},{"name":"_name","type":"bytes32"},{"name":"_dataLocation","type":"bytes32"},{"name":"_logo","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"ownerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"deletedOwner","type":"address"}],"name":"ownerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contributor","type":"address"},{"indexed":false,"name":"reciever","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"Contribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"campagin","type":"address"},{"indexed":false,"name":"reciever","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"transactionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"transactionId","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"TransactionCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"by","type":"address"},{"indexed":false,"name":"transactionId","type":"uint256"}],"name":"TransactionSigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]

if (typeof window.web3 === 'undefined') {
  var metaMaskWeb3=new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/Pd3j9YfH7kWLXAS7Sayq"));
}else{
  var metaMaskWeb3 = new Web3(window.web3.currentProvider);
  metaMaskWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;
}
var metaMaskRegistryInst =metaMaskWeb3.eth.contract(RegistryABI).at(RegistryAddress)

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

//SETUP ROUTING
var App = React.createClass({
    render: function(){
        return(
          <BrowserRouter>
            <div>
              <Route exact path='/' component={MainComponent} />
              <Route path='/:CampaignName' component={Info} />
            </div>
          </BrowserRouter >
        );
    }
});


    //SETUP ROUTING

var MainComponent = React.createClass({
  getInitialState: function(){
    return{
      name:"who are you",
      address:"what's your address",
      web3:{},
      uportRegistryInst:{},
      CampaignList : [],
      avartar:"Yex52a4QnfdeadM4vsSWy5vsNZFYCGTuWr7e4CiwrQPW"
    }
  },
  componentDidMount: async function(){
    var list = promisify(cb => metaMaskRegistryInst.getListOfCampaign.call(cb))
    list.then((campaignList)=>{
      this.setState({CampaignList:campaignList})
    })
  },
  render: function(){
    return(
      <div id = "uport-metamask">
        <h2>name: {this.state.name}</h2>
        <h2>address: {this.state.address}</h2>
        <img src={this.state.avatar} alt="avatar" width="24" height="39"/>
        <h3>list of candidates</h3>
        <ul>
          {this.state.CampaignList.map(function(campaign,index){
            return <CampaignComponent campaign={campaign} index={index}/>
          })}
        </ul>
        <button onClick={this.handleLogin}>Connect to uPort</button>
        <form id = "contribution" onSubmit={this.handleContribution}>
          <label>enter the candidate address</label>
          <input type= "text" ref="campaign" required/>
          <label>enter the desire contribution amount</label>
          <input type= "number" ref="amount" required/>
          <input type="submit"  value = "contribute!"/>
        </form>
      </div>
    );
  },
  handleLogin: function(){
    var Connect = window.uportconnect.Connect
    var SimpleSigner = window.uportconnect.SimpleSigner
    var credentials = new Connect("HuangJyunYu\'s new app", {
    clientId: "2orZ8SPR2jApEMaX6H5BzYFXx5kyBi6TQXA",
    signer: SimpleSigner("73fb2900f051fcf38d5369514ad9a904da77d5bb5a3a05e5ffaff2ea7f6c4a31"),
    network: 'rinkeby'
    })
    credentials.requestCredentials({
      requested: ['name', 'phone','avatar', 'country'],
      notifications: true // We want this if we want to recieve credentials
      }).then((credential)=>{
      this.setState({name:credential.name})
      return credential;
    }).then((credential)=>{
      this.setState({avatar: credential.avatar.uri})
      return promisify(cb => this.setState({web3:credentials.getWeb3()},cb))
    }).then(()=>{
      let uportInst = this.state.web3.eth.contract(RegistryABI).at(RegistryAddress)
      return promisify(cb => this.setState({uportRegistryInst: uportInst },cb))
    }).then(()=>{
       return promisify(cb => this.state.web3.eth.getCoinbase(cb))
    }).then((myAddress)=>{
      return promisify(cb => this.setState({address: myAddress},cb))
    })
  },

  handleContribution: function(e){
    e.preventDefault();
    var campgainAddress = this.refs.campaign.value;
    var amount = this.refs.amount.value;
    if (this.state.web3.keys().length == 0){
      let metaMaskFundInst  =metaMaskWeb3.eth.contract(CampaignFundABI).at(campgainAddress)
      let transaction = promisify(cb =>  metaMaskFundInst.contribute(amount,cb))
      transaction.then((transactionHash)=>{
        console.log(transactionHash)
      })
    }
    else{
      let uportFundInst= this.state.web3.eth.contract(CampaignFundABI).at(campgainAddress)
      let transaction = promisify(cb =>  metaMaskFundInst.contribute(amount,cb))
      transaction.then((transactionHash)=>{
        console.log(transactionHash)
      })
    }
  }
});


var CampaignComponent = React.createClass({
  render: function(){
    return(
      <div id = "Name">
        <Link to={"/"+this.props.campaign}>moreInfo</Link>
        <ul > {metaMaskWeb3.toAscii(this.props.campaign)}</ul>
        <img src={"https://ipfs.infura.io/ipfs/QmW3FgNGeD46kHEryFUw1ftEUqRw254WkKxYeKaouz7DJA"} alt="Lamp" width="24" height="39"/>
      </div>
    );
  }
});

var Info = React.createClass({
    getInitialState: function(){
      return{
        bytes32:"",
        name :"",
        info:"",
      }
    },
        //this.setState({name:metaMaskWeb3.toAscii(this.props.location.pathname.substring(1, ))})
        //this.setState({bytes32:this.props.location.pathname.substring(1, )})
    componentDidMount: function(){
      this.setState({name:metaMaskWeb3.toAscii(this.props.location.pathname.substring(1, ))})
      newPromise = promisify(cb =>  this.setState({bytes32:this.props.location.pathname.substring(1, )},cb))
      newPromise.then(()=>{
        return promisify(cb =>  metaMaskRegistryInst.getCampaignData.call(this.state.bytes32,cb))
      }).then((ipfsHash)=>{
        let fullHash= "";
        return promisify(cb =>  ipfsApi.files.cat(fullHash,cb))
      }).then((file)=>{
        console.log(file.toString('utf8'))
      })
    },

    render: function(){
        return(
            <div>
                <h2>{this.state.name}</h2>
                <h2>{this.state.info}</h2>
            </div>
        );
    }


});

// componentDidMount: function(){
//   this.setState({name:metaMaskWeb3.toAscii(this.props.location.pathname.substring(1, ))})
//   this.setState({bytes32:this.props.location.pathname.substring(1, )})
//   console.log(this.state.name)
// },
ReactDom.render(<App/> ,document.getElementById("uport-login"));


// this.state.web3.eth.sendTransaction(
//   {
//     to: "0x670C7F3FB5c61B68438624E8F00077f782FFf9D8",
//     value: 10
//   },
//   (error, txHash) => {
//     if (error) { throw error }
//   }
// )
//   function MyContractSetup () {
//     let MyRegistryABI = web3.eth.contract(PROVIDED_CONTRACT_ABI)
//     let MyContractObj = MyRegistryABI.at(DEPLOYED_CONTRACT_ADDRESS_LOCATION)
//     return MyContractObj
//   }
//   const MyContract = MyContractSetup()



// const credentials = new Connect('Terry\'s new app', {
//   clientId: '2ojQCY9AFsB2FgWYyNk7hiXyoGyYczU4z8V',
//   network: 'rinkeby',
//   signer: SimpleSigner('bec71def7b1718851726cd2b020000ee63f5c3456335d33674ef96a52929ef6f'),
//   //networks: {'0x4': {'registry' : '0x2cc31912b2b0f3075a87b3640923d45a26cef3ee', 'rpcUrl' : 'https://rinkeby.infura.io'}}
//
// })
