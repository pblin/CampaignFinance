
pragma solidity ^0.4.19;
import './Ownable.sol';


contract CampaignRegistry is Ownable {
  /* address[] private payees;
  address [] private contributors;
  address [] private campaignID; */
  struct CampaignInfo{
    string name;
    address contractAddress;
    bytes32 ipfsLocation;
  }

  mapping (address => bool) payeeMap;
  mapping (address => bool) contributorMap;
  mapping (address => bool) campaignMap;
  mapping (address => bool) candidateMap;

  event PayeeAdded(address payee);
  event contributorAdded(address contributor);
  event CampaignAdded(address campaign,address creater);
  event CandidateAdded(address candidate);

  mapping (address => bytes32) payeeData;
  mapping (address => bytes32) contributorData;
  mapping (address => bytes32) campaignData;
  mapping (address => bytes32) candidateData;


  function addPayee(address _payee, bytes32 _dataLocation) onlyOwner public {
    payeeMap[_payee]=true;
    payeeData[_payee]=_dataLocation;
    PayeeAdded(_payee);
  }

  function addContributor(address _contributor, bytes32 _dataLocation) onlyOwner public {
    contributorMap[_contributor] =true;
    payeeData[_contributor]=_dataLocation;
    contributorAdded(_contributor);
  }

  function addCampaignID(address _campaignID, address _creater, bytes32 _dataLocation)  public{
    require(candidateMap[_creater]==true);
    campaignMap[_campaignID]=true;
    campaignData[_campaignID]=_dataLocation;
    CampaignAdded(_campaignID,_creater);
  }



  function addCandidate(address _candidate,bytes32 _dataLocation) onlyOwner public {
      candidateMap[_candidate]=true;
      candidateData[_candidate]=_dataLocation;
      CandidateAdded(_candidate);
    }


  function isPayee(address _payee) public view returns (bool){
    return (payeeMap[_payee]);
  }

  function isContributor(address _contributor) public view returns (bool){
    return(contributorMap[_contributor]);
  }



  function getPayeeData(address _payee) public view returns (bytes32){
    return (payeeData[_payee]);
  }

  function getContributorData(address _contributor) public view returns (bytes32){
    return(contributorData[_contributor]);
  }

  function getCandidateData(address _candidate) public view returns (bytes32){
    return candidateData[_candidate];
  }

  function getCampaignData(address _campaignID)  public view returns (bytes32){
    return campaignData[_campaignID];
  }




}
