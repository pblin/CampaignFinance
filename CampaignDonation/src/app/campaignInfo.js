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
var infuraWeb3 = require("./util").infuraWeb3;
var eventHandler = require("./util").eventHandler;
var ZeroWeb3 = require("./util").ZeroWeb3;


var CampaignComponent = React.createClass({
  render: function(){
    return(
      <div id = "Name">
        <Link to={"/"+this.props.campaign}>moreInfo</Link>
        <ul > {metaMaskWeb3.toAscii(this.props.campaign)}</ul>
        <img src={"https://ipfs.infura.io/ipfs/QmW3FgNGeD46kHEryFUw1ftEUqRw254WkKxYeKaouz7DJA"} alt="avatar" width="50" height="50"/>
      </div>
    );
  }
});

var CampaignDetailComponent = React.createClass({
    getInitialState: function(){
      return{
        bytes32:"",
        name :"",
        info:"",
        avatar:"",
        campaignInst:{},
        datafields:[]
      }
    },
    componentDidMount: async function(){
      this.setState({name:metaMaskWeb3.toAscii(this.props.location.pathname.substring(1, ))})
      promisify(cb =>  this.setState({bytes32:this.props.location.pathname.substring(1, )},cb))
      .then(()=>{
        return promisify(cb =>  metaMaskRegistryInst.getCampaignData.call(this.state.bytes32,cb))
      }).then((ipfsHash)=>{
        let fullHash= getIpfsHashFromBytes32(ipfsHash);
        return promisify(cb =>  ipfsApi.files.cat(fullHash,cb))
      }).then((file)=>{
        return this.setState({info :file.toString('utf8')})
      }).then(()=>{
        return promisify(cb =>  metaMaskRegistryInst.getCampaignLogo.call(this.state.bytes32,cb))
      }).then((ipfsHash)=>{
        let fullHash= getIpfsHashFromBytes32(ipfsHash);
        return this.setState({avatar :"https://ipfs.infura.io/ipfs/"+fullHash})
      }).then(()=>{
        return promisify(cb => metaMaskRegistryInst.getCampaignAddress.call(this.state.name,cb))
      }).then((campgainAddress)=>{
        var campFundInst  =ZeroWeb3.eth.contract(CampaignFundABI).at(String(campgainAddress));
        this.setState({campaignInst :campFundInst})
      })
    },

    render: function(){
        return(
            <div>
                <h2>{this.state.name}</h2>
                <img src={this.state.avatar} alt="avatar" width="100" height="100"/>
                <h2>{this.state.info}</h2>
                <button onClick={this.getContributionData}>get contribution data</button>
                <button onClick={this.getPayData}>get pay data</button>
                <button onClick={this.getPendingTransactions}>get pendingTransactions data</button>
                <ul>
                  {this.state.datafields.map(function(data,index){
                    return <li>{data}</li>
                  })}
                </ul>
            </div>
        );
    },

    getContributionData:function(){
      var ContributionEvent = this.state.campaignInst["Contribution"]({},{fromBlock: 0, toBlock: "latest"});
      promisify(cb =>  ContributionEvent.get(cb)).then((res)=>{
        res = res.map(function(data){
          let contributor = String(data.args.contributor);
          let amount = Number(data.args.amount);
          let reciever = String(data.args.reciever);
          let timestamp = Number(data.args.timestamp);
          let statement =  contributor + " donated to "+ reciever +" an amount of " + String(amount)+ " at " + String(timestamp)
          return (statement)
        });
        console.log(res)
        this.setState({datafields: res});
      })
    },

    getPayData:function(){
      var TransactionEvent = this.state.campaignInst["transactionCreated"]({},{fromBlock: 0, toBlock: "latest"});
      // TransactionEvent = eventHandler(this.state.campaignInst,"TransactionCompleted",false)
      promisify(cb =>  TransactionEvent.get(cb)).then((res)=>{
        res = res.map(function(data){
          let campagin = String(data.args.campagin);
          let amount = Number(data.args.amount);
          let reciever = String(data.args.reciever);
          let timestamp = Number(data.args.timestamp);
          let statement =  campagin + " wants to pay "+ reciever +" an amount of " + String(amount)+ " at " + String(timestamp)
          return (statement)
        });
        console.log(res)
        this.setState({datafields: res});
      })
    },

    getPendingTransactions:function(){
      var pendingTransactions = promisify(cb =>  this.state.campaignInst.getPendingTransactions.call(cb))
      pendingTransactions.then((result)=>{
        result = result.map(function(data){
          return Number(data)
        });
        this.setState({datafields: result});
      })
    }
});

module.exports={
  CampaignComponent,
  CampaignDetailComponent
}
