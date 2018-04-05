import "../stylesheets/app.css";
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
import voting_artifacts from '../../build/contracts/Voting.json'
var Voting = contract(voting_artifacts);

window.startBidding = function() {
  let timeLimit=$("#timeLimit").val();
  $("#msg").html("The contarct is being deployed")
  $("#timeLimit").val("");
  Voting.deployed().then(function(contractInstance) {return contractInstance.startBidding(timeLimit, {from:web3.eth.accounts[0]})});
TotalNumberOfContracts();
}

function TotalNumberOfContracts() {
  Voting.deployed().then(function(contractInstance) {return contractInstance.myGlobalCounter()}).then(function(v) {
      $("#GlobalCounter").html(v.toString());
    });
};

 

window.Bid = function() {
  let BiddingID=$("#BiddingID").val();
  let BidHash=$("#BidHash").val();
  let BidAmount=$("#BidAmount").val();
  $("#msg").html("The Bid is being deployed")
Voting.deployed().then(function(contractInstance) {return contractInstance.Bid(BiddingID,BidHash,BidAmount,{from:web3.eth.accounts[0]})});
}

window.BidInfo = function() {
  let BidID = $("#BidID").val();
  BidInformation(BidID);
}

function BidInformation(BidID) {
  Voting.deployed().then(function(contractInstance) {return contractInstance.BidMap(BidID)}).then(function(v) {
      $("#BidIDInformation").html(v.toString());
    });
  };


$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Voting.setProvider(web3.currentProvider);

});




