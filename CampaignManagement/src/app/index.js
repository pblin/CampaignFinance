var React = require("react");
var ReactDom = require("react-dom");
import {BrowserRouter,HashRouter,Route,Link} from 'react-router-dom';
var RegistryABI = require("./util").RegistryABI;
var ERC223Address = require("./util").ERC223Address;
var ERC223ABI = require("./util").ERC223ABI;
var RegistryABI = require("./util").RegistryABI;
var CampaignFundABI = require("./util").CampaignFundABI;
var promisify = require("./util").promisify;
var getBytes32FromIpfsHash = require("./util").getBytes32FromIpfsHash;
var getIpfsHashFromBytes32 = require("./util").getIpfsHashFromBytes32;
var metaMaskWeb3 = require("./util").metaMaskWeb3;
var metaMaskRegistryInst = require("./util").metaMaskRegistryInst;
var infuraRegistryInst =require("./util").infuraRegistryInst;

class MainComponent extends React.Component {
  constructor(props) {
       super(props);
       this.state = {
         showCampaignPage : false,
         showErrorPage : false,
         campaignName :"",
         campaginAddress: "",
         campaginFundInst: null,
         datafields: [],
         balance: "",
         paymentDetails : {to: "", amount : ""}
       };

   }
   render(){
     const landingPage = (
       <div>
       <h3>enter your campaign portal by entering your campaignfund name</h3>
       <form id = "campagin-portal" onSubmit={this.displyCampaignPage.bind(this)}>
         <input type= "text" ref="name" />
         <input type="submit"  value = "enter!"/>
       </form>
       </div>
     )

     const campaginMainPage = (
       <div>
       <h1>campaign name: {this.state.campaignName}</h1>
       <h2>address : {this.state.campaignAddress}</h2>
       <h2>balance : {this.state.balance}</h2>
       <div>
       <h4>add owner</h4>
       <form id = "add-owner" onSubmit={this.addOwner.bind(this)}>
         <input type= "text" ref="address" />
         <input type="submit"  value = "add"/>
       </form>
       </div>
       <div>
       <h4>remove owner</h4>
       <form id = "remove-owner" onSubmit={this.removeOwner.bind(this)}>
         <input type= "text" ref="address" />
         <input type="submit"  value = "remove"/>
       </form>
       </div>
       <div>
       <h4>make payments</h4>
       <form id = "pay" onSubmit={this.pay.bind(this)}>
         <label>payee</label>
         <input type= "text" ref="payee" />
         <label>amount</label>
         <input type= "number" ref="amount" />
         <input type="submit"  value = "pay"/>
       </form>
       </div>
       <div>
       <h4>see payment detail</h4>
       <form id = "payment-detail" onSubmit={this.seePayment.bind(this)}>
         <label>enter pending payment Id to get details</label>
         <input type= "text" ref="id" />
         <input type="submit"  value = "peek"/>
       </form>
       </div>
       <div>
       <h4>approve payment</h4>
       <form id = "confirm-payment" onSubmit={this.confirmPayment.bind(this)}>
         <label>Pending payment Id</label>
         <input type= "text" ref="id" />
         <input type="submit"  value = "approve"/>
       </form>
       </div>
       <h3>the campaing wants to pay {this.state.paymentDetails.to} an amount of  {this.state.paymentDetails.amount}</h3>
       <button onClick = {this.uportConnect.bind(this)}>connect with uport</button>
       <button onClick = {this.showPendingPayments.bind(this)}>show Pending Payments</button>
       <button onClick = {this.showPastPayments.bind(this)}>show Past Payments</button>
       <button onClick = {this.goBack.bind(this)}>go back</button>
       <ul>
         {this.state.datafields.map(function(data,index){
           return <li>{data}</li>
         })}
       </ul>

       </div>
     )

     const errorPage = (
       <div>
       <h2>no contract at that address</h2>
       <button onClick = {this.goBack.bind(this)}>retry</button>
       </div>
     )


    if (this.state.showErrorPage) {
      console.log("error")
      return errorPage
    }
    else if (this.state.showCampaignPage){
      console.log("main")
      return campaginMainPage
    }
    else{
      return landingPage
    }


   }

   displyCampaignPage(e){
     e.preventDefault();
     var name = this.refs.name.value;
     promisify(cb => infuraRegistryInst.getCampaignAddress.call(name,cb))
     .then((address)=>{
       if (address == "0x0000000000000000000000000000000000000000"){
         this.setState({showErrorPage:true})
       }
       this.setState({campaignAddress:String(address)})
       this.setState({campaignName:name})
       let campaignInst = metaMaskWeb3.eth.contract(CampaignFundABI).at(address)
       this.setState({campaginFundInst:campaignInst})
       return campaignInst
     }).then((campaignInst)=>{
       return promisify(cb => campaignInst.getFundBalance.call(cb))
     }).then((balance)=>{
       this.setState({balance:Number(balance)})
     })
    this.setState({showCampaignPage:true})
   }

   goBack(){
     this.setState({showCampaignPage:false })
     this.setState({showErrorPage:false })

   }

   uportConnect(){
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
       return credentials.getWeb3()
     }).then((uportweb3)=>{
       let campaignInst = uportweb3.eth.contract(CampaignFundABI).at(this.state.campaignAddress)
       this.setState({campaginFundInst:campaignInst})
     })
   }

   // add owner
   addOwner(e){
     e.preventDefault();
     var owner = this.refs.addres.value;

     this.state.campaginFundInst.addOwner(owner,(err,res)=>{
       console.log(res)
     })

   }
   //remove owner
   removeOwner(e){
     e.preventDefault();
     var owner = this.refs.addres.value;

     this.state.campaginFundInst.removeOwner(owner,(err,res)=>{
       console.log(res)
     })

   }

   //sign payments
   confirmPayment(e){
     e.preventDefault();
     var id = this.refs.id.value;
     this.state.campaginFundInst.signTransaction(id,(err,res)=>{
       console.log(res)
     })
   }


   // initiates payments

   pay(e){
     e.preventDefault();
     var payee = this.refs.payee.value;
     var amount = this.refs.amount.value;
     this.state.campaginFundInst.pay(payee,amount,(err,res)=>{
       console.log(res)
     })

   }


   seePayment(e){
     e.preventDefault();
     var id = this.refs.id.value;
     promisify(cb => this.state.campaginFundInst.getPendingTransactionDetail(id,cb))
     .then((result)=>{
       let to = result[1];
       let amount = Number(result[2]);
       this.setState({paymentDetails: {to: to, amount: amount}})
     })
   }

   // list all pending payments

   showPendingPayments(){
     var pendingTransactions = promisify(cb =>  this.state.campaginFundInst.getPendingTransactions.call(cb))
     pendingTransactions.then((result)=>{
       result = result.map(function(data){
         return Number(data)
       });
       this.setState({datafields: result});
     })
   }


   //list all past payments
   showPastPayments(){
     var TransactionEvent = this.state.campaginFundInst["transactionCreated"]({},{fromBlock: 0, toBlock: "latest"});
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

   }

}
ReactDom.render(<MainComponent/> ,document.getElementById("login"));
