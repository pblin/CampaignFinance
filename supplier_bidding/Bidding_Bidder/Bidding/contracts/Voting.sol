pragma solidity ^0.4.19;

import './ERC223.sol';
import './SafeMath.sol';
import './Token.sol';

contract Voting{
    
    ERC223Token public token;
	struct Bidding{
	// structure of the bidding
	uint deadLine; // denotes the end time for the auction.
	bytes32 bidHash; // the hash which will be sent by the winner of the Bidding for payment release
	address lowestBidder; // current lowest Bidder
	uint lowestBid; // the current amount for the lowest Bid
	address Sender; // the person who will receive money for the lowest bid.
	}
	
	

	mapping (uint=>Bidding) public BidMap; // A hashmap for BidId to the Bidding Structure.
	uint public myGlobalCounter; //keeps count for the number of Bidding Contracts.

	function startBidding(uint timeLimit) returns (uint BiddingID){
	BiddingID= myGlobalCounter++;
	BidMap[BiddingID].deadLine=block.number+timeLimit;
	BidMap[BiddingID].Sender=msg.sender;
	BidMap[BiddingID].lowestBid=100000;
	}

	function Bid(uint BiddingID, bytes32 BidderHash, uint BidAmount) returns (address lowestBidder){
	Bidding B = BidMap[BiddingID];
	if (B.lowestBid<BidAmount || B.deadLine<block.number) {
	return B.lowestBidder;
	}
	B.lowestBidder=msg.sender;
	B.lowestBid= BidAmount;
	B.bidHash= BidderHash;
	return B.lowestBidder;
	}

	function BidEnd(uint BiddingID, bytes32 key) returns (address lowestBidder){
	Bidding B = BidMap[BiddingID];
	return B.lowestBidder;
	//if (block.number>=B.deadLine && token.balanceOf(B.Sender)>=B.lowestBid ){
	//token.transfer(B.lowestBidder,B.lowestBid);
	//CF.pay(B.lowestBidder,B.lowestBid);
	//return B.lowestBidder;
	//clean(BiddingID);
	//}
	}
	

	function clean(uint BiddingID) {
	Bidding B = BidMap[BiddingID];
	B.deadLine=0;
	B.bidHash=0;
	B.lowestBidder=0;
	B.lowestBid=0;
	B.Sender=0;
	}

}
