var React = require("react");
var ReactDom = require("react-dom");
import {BrowserRouter,HashRouter,Route,Link} from 'react-router-dom';
var RegistryABI = require("./util").RegistryABI;
var RegistryAddress = require("./util").RegistryAddress;
var CampaignFundABI = require("./util").CampaignFundABI;
var promisify = require("./util").promisify;
var getBytes32FromIpfsHash = require("./util").getBytes32FromIpfsHash;
var getIpfsHashFromBytes32 = require("./util").getIpfsHashFromBytes32;
var metaMaskWeb3 = require("./util").metaMaskWeb3;
var metaMaskRegistryInst = require("./util").metaMaskRegistryInst;
var infuraWeb3 =require("./util").infuraWeb3;

class MainComponent extends React.Component {
  constructor(props) {
       super(props);
       this.state = {
       };

   }
   render(){
     const MainPage =(
       <div>
       </div>
     )
     return(
       <h1>hi</h1>
     )

   }
   //display balances
   componentDidMount(){

   }
   // add owner
   addOwner(){

   }
   //remove owner
   removeOwner(){

   }

   //sign payments
   confirmPayment(){

   }


   // initiates payments

   pay(){

   }


   // list all pending payments

   showPendingPayments(){

   }


   //list all past payments
   showPastPayments(){

   }

}

ReactDom.render(<MainComponent/> ,document.getElementById("login"));
