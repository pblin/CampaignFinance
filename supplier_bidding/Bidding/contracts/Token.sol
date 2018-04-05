pragma solidity ^0.4.19;

import './ERC223.sol';
import './SafeMath.sol';

contract TokenSale {
    uint public totalTokens; 
    uint public balanceTokens; 
    uint public tokenPrice; 
    address public owner;
    ERC223Token public token;
    uint public tokensBought;
    
    function TokenSale(uint256 _tokenSupply,string _tokenName, uint8 _tokenDecimals, string _tokenSymbol) public {
        owner= msg.sender;
        totalTokens=_tokenSupply;
        token = new ERC223Token(_tokenSupply, _tokenName, _tokenDecimals, _tokenSymbol, this);
        tokensBought=0;
  }

  
  function getTokens(uint amount) public{
      token.transfer(msg.sender,amount);
      tokensBought = tokensBought + amount;
  }
  
  
  function getBalances() public returns(uint){
      return token.balanceOf(msg.sender);
  }
  
  function tokensRemaining() public returns(uint totaltokensRemaining){
      return (totalTokens - tokensBought);
  }
}
  
  
