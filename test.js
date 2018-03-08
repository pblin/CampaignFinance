var React = require("react");
var ReactDom = require("react-dom");
const contractABI= [{"constant":false,"inputs":[],"name":"add","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
const contractAddress ="0xfdb0966e809e851baf6083f9c20bac53dad7727f"

const Web3 = require('web3');

if (typeof window.web3 === 'undefined') {
  var metaMaskWeb3=new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/Pd3j9YfH7kWLXAS7Sayq"));
}else{
  var metaMaskWeb3 = new Web3(window.web3.currentProvider);
  metaMaskWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;
}

var metaMaskInstance =metaMaskWeb3.eth.contract(contractABI).at(contractAddress)





var UportComponent = React.createClass({
  getInitialStatate: function(){
    return{
      web3:{},
      contractInstance:{},
      listOfCampaigns: {},
      name:"",
      address:"",
    }
  },
  render: function(){
    return(
      <div id = "uport-metamask">
        <button onClick={this.handleLogin}>Connect to uPort</button>
        <form id = "contribution" onSubmit={this.handleContribution}>
          <label>enter the candidate address</label>
          <input type= "text" ref="campaign" required/>
          <label>enter the desire contribution amount</label>
          <input type= "number" ref="amount" required/>
          <input type="submit" value = "contribute!"/>
        </form>
        <h2>hi</h2>
        <button onClick={this.handleCampaign}> get list of campaign </button>
        <button onClick ={this.metamaskSign}> call function with metamask</button>
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
      this.setState({web3:credentials.getWeb3()},function(){
        let MyContractABI = this.state.web3.eth.contract(contractABI)
        let MyContractObj = MyContractABI.at(contractAddress)
        this.setState({contractInstance: MyContractObj })
      })
      return credential;
    }).then((credential)=>{
      var EthAddress
      this.state.web3.eth.getCoinbase(function(err,res){
          EthAddress= res;
      })
      return EthAddress;
    }).then((EthAddress)=>{
      this.setState({address: EthAddress});
    })

  },

  handleContribution: function(e){
    e.preventDefault();
    var campgain = this.refs.campaign.value;
    var amount = this.refs.amount.value;
    this.state.contractInstance.add(function(err,res){
      console.log(err)
      console.log(res)
    })

  },
  handleCampaign: function(){
    console.log(this.state.name)
    console.log(this.state.address)

    metaMaskInstance.get.call(function(err,res){
      console.log(err)
      console.log(Number(res))
    })
    // testInstnace.get(function(err,res){
    //   console.log(err)
    //   console.log(res)
    // })
    //
  },
  metamaskSign:function(){
    metaMaskInstance.add(function(err,res){
      console.log(err)
      console.log(res)
    })

  }

});
ReactDom.render(<UportComponent/>,document.getElementById("uport-login"));


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
//     let MyContractABI = web3.eth.contract(PROVIDED_CONTRACT_ABI)
//     let MyContractObj = MyContractABI.at(DEPLOYED_CONTRACT_ADDRESS_LOCATION)
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


//
// function startApp(web3) {
//   console.log(web3)
// }
//
// window.addEventListener('load', function() {
//   getWeb3(startApp);
// });


//var Web3 = require('web3');
//create component
// var TodoComponent = React.createClass({
//   render: function(){
//     return(
//       <div>
//       <h1>hellooo</h1>
//       <p>{this.props.mssg}</p>
//       <p><strong>cheese name:</strong> {this.props.cheese.name}</p>
//       <p><strong>cheese smell:</strong> {this.props.cheese.smellFactor}</p>
//       <p><strong>cheese price:</strong> {this.props.cheese.price}</p>
//       </div>
//     );
//   }
// });
//
// var myCheese={name :"camembert", smellFactor: "extreme Pong", price: "4.20"}
// // put component into html page
// ReactDom.render(<TodoComponent mssg="i like cheese" cheese = {myCheese}/>,document.getElementById("todo-wrapper"));
