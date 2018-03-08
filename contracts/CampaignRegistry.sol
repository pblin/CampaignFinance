
pragma solidity ^0.4.19;
import './Ownable.sol';


contract CampaignRegistry is Ownable {
  CampaignInfo[] CampaignList;
  struct CandidateInfo{
    string name;
    address walletAddress;
    bytes32 ipfsLocation;
  }

  struct CampaignInfo{
    string name;
    address contractAddress;
    bytes32 ipfsLocation;
  }

  struct PayeeInfo{
    string name;
    address walletAddress;
    bytes32 ipfsLocation;

  }

  struct ContributorInfo{
    string name;
    address walletAddress;
    bytes32 ipfsLocation;
  }

  mapping (address => PayeeInfo) payeeMap;
  mapping (address => ContributorInfo) contributorMap;
  mapping (address => CampaignInfo) campaignMap;
  mapping (address => CandidateInfo) candidateMap;

  event PayeeAdded(address payee);
  event contributorAdded(address contributor);
  event CampaignAdded(address campaign,address creater);
  event CandidateAdded(address candidate);


  function addPayee(address _payee, string _name, bytes32 _dataLocation) onlyOwner public {
    PayeeInfo memory newPayee = PayeeInfo(_name, _payee, _dataLocation);
    payeeMap[_payee]=newPayee;
    PayeeAdded(_payee);
  }

  function addContributor(address _contributor,string _name, bytes32 _dataLocation) onlyOwner public {
    ContributorInfo memory newContributor = ContributorInfo(_name, _contributor, _dataLocation);
    contributorMap[_contributor]=newContributor;
    contributorAdded(_contributor);
  }

  function addCampaignID(address _campaignID, string _name, address _creater, bytes32 _dataLocation)  public{
    require(candidateMap[_creater].walletAddress!=address(0));
    CampaignInfo memory newCampaign = CampaignInfo(_name, _campaignID, _dataLocation);

    campaignMap[_campaignID]=newCampaign;
    CampaignList.push(newCampaign);
    CampaignAdded(_campaignID,_creater);
  }



  function addCandidate(address _candidate,string _name, bytes32 _dataLocation) onlyOwner public {
      CandidateInfo memory newCandidate = CandidateInfo(_name, _candidate, _dataLocation);
      candidateMap[_candidate] = newCandidate;
      CandidateAdded(_candidate);
    }


  function isPayee(address _payee) public view returns (bool){
    return (payeeMap[_payee].walletAddress!=address(0));
  }

  function isContributor(address _contributor) public view returns (bool){
    return(contributorMap[_contributor].walletAddress!=address(0));
  }



  function getPayeeData(address _payee) public view returns (bytes32){
    return (payeeMap[_payee].ipfsLocation);
  }

  function getContributorData(address _contributor) public view returns (bytes32){
    return(contributorMap[_contributor].ipfsLocation);
  }

  function getCandidateData(address _candidate) public view returns (bytes32){
    return candidateMap[_candidate].ipfsLocation;
  }

  function getCampaignData(address _campaignID)  public view returns (bytes32){
    return campaignMap[_campaignID].ipfsLocation;
  }




}
