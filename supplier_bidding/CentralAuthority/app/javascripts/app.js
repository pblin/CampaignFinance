import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import voting_artifacts from '../../build/contracts/Voting.json'
var Voting = contract(voting_artifacts);

window.buyTokens = function() {
  let tokensToBuy = $("#buy").val();
  $("#buy-msg").html("Purchase order has been submitted. Please wait.");
  Voting.deployed().then(function(contractInstance) {return contractInstance.getTokens(tokensToBuy,{from: web3.eth.accounts[0]})});
  populateTokenData();
}

function populateTokenData() {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.totalTokens.call().then(function(v) {
      $("#tokens-total").html(v.toString());
    });
    contractInstance.tokensBought.call().then(function(v) {
      $("#tokens-sold").html(v.toString());
    });
  });
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
web3.currentProvider.isMetaMask === true;
   // window.web3 = new Web3(web3.currentProvider.isMetaMask==true);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Voting.setProvider(web3.currentProvider);

});
