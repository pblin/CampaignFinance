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
var ERC223ABI = require("./util").ERC223ABI;
var ERC223Address = require("./util").ERC223Address;
var infuraWeb3 =require("./util").infuraWeb3;
var RegisterForContributor = require("./api").RegisterForContributor;
var RegisterForCandidate = require("./api").RegisterForCandidate;
var RegisterForPayee = require("./api").RegisterForPayee;
var campaignFundByteCode = require("./util").campaignFundByteCode;

const MAX_DONATION= 1000;
const gasEstimate = 1945038

var App = React.createClass({
    render: function(){
        return(
          <BrowserRouter>
            <div>
              <Route exact path='/' component={MainComponent} />
            </div>
          </BrowserRouter >
        );
    }
});



class MainComponent extends React.Component {
  constructor(props) {
       super(props);
       this.state = {
         showCandidateForm: false,
         showContributorForm: false,
         showCampaignForm: false,
         showMainPage: true,
         name:"",
         public_key: "",
         email:"",
         age:0,
         uportweb3:{},
         metaMaskWeb3:{},
         campaignAddress:"",
         coinBaseAccount:"",
         deployTxHash : ""
       };

   }


  render() {
    const buttonPage = (
      <div>
        <button onClick={this.displayContributerSignup.bind(this)}>Register as Contributor</button>
        <button onClick={this.displayCandidateSignup.bind(this)}>Register as Candidate</button>
        <button onClick={this.displayPayeeSignup.bind(this)}>Register as Payee</button>
        <button onClick={this.displayCampaignCreation.bind(this)}> Register a New Campaign</button>
      </div>
    );

    const ContributorForm = (
      <div>
      <h2>Contributor registration</h2>
      <form id = "register-contributor" onSubmit={this.handleContributorRegistration.bind(this)}>
        <label>Enter your name</label>
        <input type= "text" ref="name" value = {this.state.name}  onChange ={e => this.nameChange(e.target.value)}/>
        <label>enter your public address</label>
        <input type= "text" ref="address" value = {this.state.public_key} onChange ={e => this.addressChange(e.target.value)} required/>
        <label>enter your age</label>
        <input type= "number" ref="age" />
        <input type="submit"  value = "register!"/>
      </form>
      <div>
      <textarea rows="4" cols="50" id="contributor_Info" >Enter your information here...</textarea>
      </div>
      <button onClick={this.uportSignup.bind(this)}>uport</button>
      <button onClick={this.metamaskSignup.bind(this)}>metamask</button>
      <button onClick = {this.goBack.bind(this)}> go back </button>
      </div>
    );

    const CandidateForm = (
      <div>
      <h2>Candidate registration</h2>
      <form id = "register-candidate" onSubmit={this.handleCandidateRegistration.bind(this)}>
        <label>Enter your name</label>
        <input type= "text" ref="name" value = {this.state.name} onChange ={e => this.nameChange(e.target.value)}/>
        <label>enter your public address</label>
        <input type= "text" ref="address" value = {this.state.public_key} onChange ={e => this.addressChange(e.target.value)} required/>
        <label>enter your age</label>
        <input type= "number" ref="age" />
        <input type="submit"  value = "register!"/>
      </form>
      <div>
      <textarea rows="4" cols="50" id="candidate_Info" >Enter your information here...</textarea>
      </div>
      <button onClick={this.uportSignup.bind(this)}>uport</button>
      <button onClick={this.metamaskSignup.bind(this)}>metamask</button>
      <button onClick = {this.goBack.bind(this)}> go back </button>
      </div>
    );

    const PayeeForm = (
      <div>
      <h2>payee registration</h2>
      <form id = "register-payee" onSubmit={this.handlePayeeRegistration.bind(this)}>
        <label>Enter your name</label>
        <input type= "text" ref="name" value = {this.state.name} onChange ={e => this.nameChange(e.target.value)}/>
        <label>enter your public address</label>
        <input type= "text" ref="address" value = {this.state.public_key} onChange ={e => this.addressChange(e.target.value)} required/>
        <label>enter your age</label>
        <input type= "number" ref="age" />
        <input type="submit"  value = "register!"/>
      </form>
      <div>
      <textarea rows="4" cols="50" id="payee_Info" >Enter your information here...</textarea>
      </div>
      <button onClick={this.uportSignup.bind(this)}>uport</button>
      <button onClick={this.metamaskSignup.bind(this)}>metamask</button>
      <button onClick = {this.goBack.bind(this)}> go back </button>
      </div>
    );

    const CampaignForm =(
      <div>
      <h2>payee registration</h2>
      <form id = "register-campaign" onSubmit={this.handleCampaignRegistration.bind(this)}>
        <label>Enter your name</label>
        <input type= "text" ref="name" value = {this.state.name} onChange ={e => this.nameChange(e.target.value)}/>
        <label>enter the IPFS hash of campaign info</label>
        <input type= "text" ref="info" required/>
        <label>enter the IPFS hash of campaign logo</label>
        <input type= "text" ref="logo" />
        <input type="submit"  value = "register!"/>
      </form>
      <h3>tx hash deployment is {this.state.deployTxHash}</h3>
      <h3>your campaign fund address is : {this.state.campaignAddress}</h3>
      <button onClick={this.uportConnect.bind(this)}>connect to uport</button>
      <button onClick={this.metamaskConnect.bind(this)}>connect to MetaMask</button>
      <button onClick = {this.goBack.bind(this)}> go back </button>
      <h3>the account you are using to deploy is {this.state.coinBaseAccount}</h3>
      </div>
    )


    if (this.state.showCandidateForm){
      return(
        CandidateForm
      )
    }
    else if (this.state.showContributorForm) {
      return(
        ContributorForm
      )
    }
    else if (this.state.showPayeeForm) {
      return(
        PayeeForm
      )
    }
    else if (this.state.showCampaignForm) {
      return(
        CampaignForm
      )
    }
    else if (this.state.showMainPage){
      return(
        buttonPage
      )
    }
  }

  displayCampaignCreation(){
    this.setState({showCampaignForm: true });
  }

  goBack(){
    this.setState({showMainPage: true, showContributorForm: false,showPayeeForm: false,showCandidateForm: false,showCampaignForm: false });
  }

  displayCandidateSignup() {
      this.setState({showCandidateForm: true });

  }

  displayContributerSignup(){
    this.setState({showContributorForm: true });
  }

  displayPayeeSignup(){
    this.setState({showPayeeForm: true });
  }

  nameChange(value){
          this.setState({
               name: value
          });
      }

 addressChange(value){
         this.setState({
              public_key: value
         });
     }


  handleContributorRegistration(e){
      e.preventDefault();
      var name = this.refs.name.value;
      var publicAddress = this.refs.address.value;
      var age = this.refs.age.value;
      var info = document.getElementById('contributor_Info').value;
      RegisterForCandidate(name, publicAddress, info, age).then(
        response => {
          console.log(response)
        },
        error => {
          console.log(error)
        }
      );
  }

  handleCandidateRegistration(e){
    e.preventDefault();
    var name = this.refs.name.value;
    var publicAddress = this.refs.address.value;
    var age = this.refs.age.value;
    var info = document.getElementById('candidate_Info').value;
    RegisterForContributor(name, publicAddress, info, age).then(
      response => {
        console.log(response)
      },
      error => {
        console.log(error)
      }
    );
  }

  handlePayeeRegistration(e){
    e.preventDefault();
    var name = this.refs.name.value;
    var publicAddress = this.refs.address.value;
    var age = this.refs.age.value;
    var info = document.getElementById('payee_Info').value;
    RegisterForPayee(name, publicAddress, info, age).then(
      response => {
        console.log(response)
      },
      error => {
        console.log(error)
      }
    );
  }


  uportSignup(){
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
      //mayme return credential
    }).then((credential)=>{
      return promisify(cb => this.setState({uportweb3:credentials.getWeb3()},cb))
    }).then(()=>{
       return promisify(cb => this.state.uportweb3.eth.getCoinbase(cb))
    }).then((myAddress)=>{
      return promisify(cb => this.setState({public_key: myAddress},cb))
    })

  }

  metamaskSignup(){
    this.setState({public_key: metaMaskWeb3.eth.accounts[0]})
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
      this.setState({name:credential.name})
    }).then((credential)=>{
      return promisify(cb => this.setState({uportweb3:credentials.getWeb3()},cb))
    }).then(()=>{
       return promisify(cb => this.state.uportweb3.eth.getCoinbase(cb))
    }).then((myAddress)=>{
      return promisify(cb => this.setState({coinBaseAccount: myAddress},cb))
    })


  }

  metamaskConnect(){
    this.setState({coinBaseAccount: metaMaskWeb3.eth.accounts[0]})
  }

  handleCampaignRegistration(e){
    e.preventDefault();
    var name = String(this.refs.name.value);
    var info = String(this.refs.info.value);
    var logo = String(this.refs.logo.value);
    if (info.length==46){
      info = getBytes32FromIpfsHash(info);

    }
    if (logo.length==46){

      logo = getBytes32FromIpfsHash(logo);

    }
    if (Object.keys(this.state.uportweb3).length == 0){
      //metamask to deploy
      let FundContract = metaMaskWeb3.eth.contract(CampaignFundABI);
      FundContract.new(MAX_DONATION ,name, info, logo,{
         from:this.state.coinBaseAccount,
         data:campaignFundByteCode,
         gas:gasEstimate}, function(err, myContract){
           //Note this gets fire twice, once for tx hash, once for mined.
          if(!err) {
             if(!myContract.address) {
                 console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract
                 this.setState({deployTxHash:myContract.transactionHash})

             } else {
                 console.log(myContract.address) // the contract address
                 this.setState({campaignAddress:myContract.address})
             }
          }
        }.bind(this));


    }
    else{
      //use uport to deploy
      let FundContract = uportweb3.eth.contract(CampaignFundABI);
      FundContract.new(MAX_DONATION ,name, info, logo,{
         from:this.state.coinBaseAccount,
         data:campaignFundByteCode,
         gas:gasEstimate}, function(err, myContract){
          if(!err) {
             if(!myContract.address) {
                this.setState({deployTxHash:myContract.transactionHash})
                 console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract

             } else {
                 console.log(myContract.address) // the contract address
                 this.setState({campaignAddress:myContract.address})
             }
          }
        }.bind(this));



    }

  }


}

ReactDom.render(<App/> ,document.getElementById("registration"));
