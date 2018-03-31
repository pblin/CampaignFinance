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




var MainComponent = React.createClass({

    getInitialState: function(){
      return{
        showCandidateForm: false,
        showContributorForm: false,
        showMainPage: true,
        name:"",
        public_key: "",
        email:"",
        age:0,
        uportweb3:{}
      }
    },

    render: function(){
      const buttonPage = (
        <div>
          <button onClick={this.displayContributerSignup}>Register as Contributor</button>
          <button onClick={this.displayCandidateSignup}>Register as Candidate</button>
          <button onClick={this.displayPayeeSignup}>Register as Payee</button>
        </div>
      );

      const ContributorForm = (
        <div>
        <h2>Contributor registration</h2>
        <form id = "register" onSubmit={this.handleContributorRegistration}>
          <label>Enter your name</label>
          <input type= "text" ref="name" value = {this.state.name}  />
          <label>enter your public address</label>
          <input type= "text" ref="address" value = {this.state.public_key} required/>
          <label>enter your info</label>
          <input type= "text" ref="info" />
          <label>enter your age</label>
          <input type= "number" ref="age" />
          <input type="submit"  value = "register!"/>
        </form>
        <button onClick={this.uportSignup}>uport</button>
        <button onClick={this.metamaskSignup}>metamask</button>
        <button onClick = {this.goBack}> go back </button>
        </div>
      );

      const CandidateForm = (
        <div>
        <h2>Candidate registration</h2>
        <form id = "register" onSubmit={this.handleCandidateRegistration}>
          <label>Enter your name</label>
          <input type= "text" ref="name" value = {this.state.name}  />
          <label>enter your public address</label>
          <input type= "text" ref="address" value = {this.state.public_key} required/>
          <label>enter your info</label>
          <input type= "text" ref="info" />
          <label>enter your age</label>
          <input type= "number" ref="age" />
          <input type="submit"  value = "register!"/>
        </form>
        <button onClick={this.uportSignup}>uport</button>
        <button onClick={this.metamaskSignup}>metamask</button>
        <button onClick = {this.goBack}> go back </button>
        </div>
      );

      const PayeeForm = (
        <div>
        <h2>payee registration</h2>
        <form id = "register" onSubmit={this.handlePayeeRegistration}>
          <label>Enter your name</label>
          <input type= "text" ref="name"  />
          <label>enter your public address</label>
          <input type= "text" ref="address" required/>
          <label>enter your info</label>
          <input type= "text" ref="info" />
          <label>enter your age</label>
          <input type= "number" ref="age" />
          <input type="submit"  value = "register!"/>
        </form>
        <button onClick={this.uportSignup}>uport</button>
        <button onClick={this.metamaskSignup}>metamask</button>
        <button onClick = {this.goBack}> go back </button>
        </div>
      );


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
      else if (this.state.showMainPage){
        return(
          buttonPage
        )
      }

    },

  goBack: function(){
    console.log("hi")
    this.setState({showMainPage: true, showContributorForm: false,showPayeeForm: false,showCandidateForm: false });
  },

  displayCandidateSignup: function() {
      this.setState({showCandidateForm: true });

  },

  displayContributerSignup: function(){
    this.setState({showContributorForm: true });
  },

  displayPayeeSignup: function(){
    this.setState({showPayeeForm: true });
  },

  handleContributorRegistration: function(e){
      e.preventDefault();
      var name = this.refs.name.value;
      var publicAddress = this.refs.address.value;
      var info = this.refs.info.value;
      var age = this.refs.age.value;
      RegisterForCandidate(name, publicAddress, info, age).then(
        response => {
          console.log(response)
        },
        error => {
          console.log(error)
        }
      );
  },

  handleCandidateRegistration: function(e){
    e.preventDefault();
    var name = this.refs.name.value;
    var publicAddress = this.refs.address.value;
    var info = this.refs.info.value;
    var age = this.refs.age.value;
    RegisterForContributor(name, publicAddress, info, age).then(
      response => {
        console.log(response)
      },
      error => {
        console.log(error)
      }
    );
  },

  handlePayeeRegistration: function(e){
    e.preventDefault();
    var name = this.refs.name.value;
    var publicAddress = this.refs.address.value;
    var info = this.refs.info.value;
    var age = this.refs.age.value;
    RegisterForPayee(name, publicAddress, info, age).then(
      response => {
        console.log(response)
      },
      error => {
        console.log(error)
      }
    );
  },


  uportSignup: function(){
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
      return promisify(cb => this.setState({public_key: myAddress},cb))
    })

  },

  metamaskSignup: function(){
    this.setState({public_key: metaMaskWeb3.eth.accounts[0]})
  }

})
ReactDom.render(<App/> ,document.getElementById("registration"));


// {
//   "jsonrpc":"2.0",
//   "method":"eth_sendTransaction",
//   "params": [{"from":"",
//   "gas":"",
//   "value":"",
//   "to":"",
//   "data":"",
//   "gasPrice":""}]
// }
