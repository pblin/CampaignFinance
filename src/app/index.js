var React = require("react");
var ReactDom = require("react-dom");
const contractABI= [{"constant":false,"inputs":[],"name":"add","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
const contractAddress ="0xfdb0966e809e851baf6083f9c20bac53dad7727f"

 const Web3 = require('web3');
// const InfuraWeb3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/Pd3j9YfH7kWLXAS7Sayq"));
// let testInstnace = InfuraWeb3.eth.contract(contractABI).at(contractAddress)



var UportComponent = React.createClass({
  getInitialStatate: function(){
    return{
      web3:{},
      contractInstance:{}
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
      console.log(credential)
      this.setState({web3:credentials.getWeb3()},function(){
        let MyContractABI = this.state.web3.eth.contract(contractABI)
        let MyContractObj = MyContractABI.at(contractAddress)
        this.setState({contractInstance: MyContractObj })
      })
      this.state.web3.eth.getCoinbase(function(err,res){
        console.log(res)
      })
    })

  },

  handleContribution: function(e){
    e.preventDefault();
    var campgain = this.refs.campaign.value;
    var amount = this.refs.amount.value;
    this.state.contractInstance.add.call(function(err,res){
      console.log(err)
      console.log(res)
    })

  },
  handleCampaign: function(){
    // testInstnace.get(function(err,res){
    //   console.log(err)
    //   console.log(res)
    // })

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


// function getWeb3(callback) {
//   if (typeof window.web3 === 'undefined') {
//     // no web3, use fallback
//     console.error("Please use a web3 browser");
//   } else {
//     // window.web3 == web3 most of the time. Don't override the provided,
//     // web3, just wrap it in your Web3.
//     var myWeb3 = new Web3(window.web3.currentProvider);
//
//     // the default account doesn't seem to be persisted, copy it to our
//     // new instance
//     myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;
//
//     callback(myWeb3);
//   }
// }

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
