var React = require("react");
var ReactDom = require("react-dom");
const ipfsAPI = require('ipfs-api');
const ipfsApi = new ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
import {BrowserRouter,HashRouter,Route,Link} from 'react-router-dom';

var RegistryABI = require("./util").RegistryABI;
var RegistryAddress = require("./util").RegistryAddress;
var CampaignFundABI = require("./util").CampaignFundABI;
var promisify = require("./util").promisify;
var getBytes32FromIpfsHash = require("./util").getBytes32FromIpfsHash;
var getIpfsHashFromBytes32 = require("./util").getIpfsHashFromBytes32;
var metaMaskWeb3 = require("./util").metaMaskWeb3;
var metaMaskRegistryInst = require("./util").metaMaskRegistryInst;
var ERC223ABI = require("./util").ERC223ABI;
var ERC223Address = require("./util").ERC223Address;
var infuraWeb3 =require("./util").infuraWeb3

var CampaignComponent = require("./campaigninfo").CampaignComponent
var CampaignDetailComponent = require("./campaigninfo").CampaignDetailComponent


infuraWeb3.eth.getTransactionReceiptMined = function (txnHash, interval) {
    var transactionReceiptAsync;
    interval = interval ? interval : 500;
    transactionReceiptAsync = function(txnHash, resolve, reject) {
        try {
            var receipt = infuraWeb3.eth.getTransactionReceipt(txnHash);
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
            promises.push(infuraWeb3.eth.getTransactionReceiptMined(oneTxHash, interval));
        });
        return Promise.all(promises);
    } else {
        return new Promise(function (resolve, reject) {
                transactionReceiptAsync(txnHash, resolve, reject);
            });
    }
};

//SETUP ROUTING
var App = React.createClass({
    render: function(){
        return(
          <BrowserRouter>
            <div>
              <Route exact path='/' component={MainComponent} />
              <Route path='/:CampaignName' component={CampaignDetailComponent} />
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
        <img src={this.state.avatar} alt="avatar" width="30" height="30"/>
        <h3>list of candidates</h3>
        <ul>
          {this.state.CampaignList.map(function(campaign,index){
            return <CampaignComponent campaign={campaign} index={index}/>
          })}
        </ul>
        <button onClick={this.handleLogin}>Connect to uPort</button>
        <form id = "contribution" onSubmit={this.handleContribution}>
          <label>enter the name of the campaign</label>
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

  handleContribution: async function(e){
    e.preventDefault();
    var campgainName = this.refs.campaign.value;
    var amount = this.refs.amount.value;
    var campgainAddress;
    campgainAddress = await promisify(cb => metaMaskRegistryInst.getCampaignAddress.call(campgainName,cb))
    if (Object.keys(this.state.web3).length == 0){
      var metaMaskFundInst  =metaMaskWeb3.eth.contract(CampaignFundABI).at(String(campgainAddress));
      var metaMaskTokenInst = metaMaskWeb3.eth.contract(ERC223ABI).at(ERC223Address);
      let approve= promisify(cb =>  metaMaskTokenInst.approve(campgainAddress,amount,{from: metaMaskWeb3.eth.accounts[0]},cb))
      approve.then((txHash)=>{
        console.log(txHash)
        infuraWeb3.eth.getTransactionReceiptMined(txHash).then((receipt)=>{
          console.log(receipt)
          return promisify(cb =>  metaMaskFundInst.contribute(amount,cb))
        }).then((transactionHash)=>{
          console.log(transactionHash)
        })
      })
    }
    else{
      let uportFundInst= this.state.web3.eth.contract(CampaignFundABI).at(campgainAddress)
      let uportTokenInst = this.state.web3.eth.contract(ERC223ABI).at(ERC223Address);
      let approve= promisify(cb =>  uportTokenInst.approve(campgainAddress,amount,{from: this.state.address},cb))
      approve.then((txHash)=>{
        console.log(txHash)
        infuraWeb3.eth.getTransactionReceiptMined(txHash).then((receipt)=>{
          console.log(receipt)
          return promisify(cb =>  uportFundInst.contribute(amount,cb))
        }).then((transactionHash)=>{
          console.log(transactionHash)
        })
      })
    }
  }
});




ReactDom.render(<App/> ,document.getElementById("landing-page"));




// const credentials = new Connect('Terry\'s new app', {
//   clientId: '2ojQCY9AFsB2FgWYyNk7hiXyoGyYczU4z8V',
//   network: 'rinkeby',
//   signer: SimpleSigner('bec71def7b1718851726cd2b020000ee63f5c3456335d33674ef96a52929ef6f'),
//   //networks: {'0x4': {'registry' : '0x2cc31912b2b0f3075a87b3640923d45a26cef3ee', 'rpcUrl' : 'https://rinkeby.infura.io'}}
//
// })
