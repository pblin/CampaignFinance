pragma solidity ^0.4.18;


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}



contract CampaignRegistry is Ownable {
  bytes32[] CampaignNameList;

  struct CandidateInfo{
    bytes32 name;
    address walletAddress;
    bytes32 ipfsLocation;
  }

  struct CampaignInfo{
    bytes32 name;
    bytes32 ipfsLocation;
  }

  struct PayeeInfo{
    bytes32 name;
    address walletAddress;
    bytes32 ipfsLocation;

  }

  struct ContributorInfo{
    bytes32 name;
    address walletAddress;
    bytes32 ipfsLocation;
  }

  mapping (address => PayeeInfo) payeeMap;
  mapping (address => ContributorInfo) contributorMap;
  mapping (address => CampaignInfo) campaignMap;
  mapping (address => CandidateInfo) candidateMap;

  mapping (bytes32 => address) nameToCampaign;
  mapping (bytes32 => bytes32) nameToLogo;

  event PayeeAdded(address payee, bytes32 name, bytes32 ipfs);
  event contributorAdded(address contributor, bytes32 name, bytes32 ipfs);
  event CampaignAdded(address campaign,address creater, bytes32 name, bytes32 ipfs);
  event CandidateAdded(address candidate, bytes32 name, bytes32 ipfs);


  function addPayee(address _payee, bytes32 _name, bytes32 _dataLocation) onlyOwner public {
    PayeeInfo memory newPayee = PayeeInfo(_name, _payee, _dataLocation);
    payeeMap[_payee]=newPayee;
    PayeeAdded(_payee,_name,_dataLocation);
  }

  function addContributor(address _contributor,bytes32 _name, bytes32 _dataLocation) onlyOwner public {
    ContributorInfo memory newContributor = ContributorInfo(_name, _contributor, _dataLocation);
    contributorMap[_contributor]=newContributor;
    contributorAdded(_contributor,_name,_dataLocation);
  }

  function addCampaignID(address _campaignID, address _creater, bytes32 _name, bytes32 _dataLocation, bytes32 _logo)  public{
    require(candidateMap[_creater].walletAddress != address(0));
    CampaignInfo memory newCampaign = CampaignInfo(_name, _dataLocation);
    CampaignNameList.push(_name);
    nameToCampaign[_name]=_campaignID;
    nameToLogo[_name]=_logo;
    campaignMap[_campaignID]=newCampaign;
    CampaignAdded(_campaignID,_creater,_name,_dataLocation);
  }



  function addCandidate(address _candidate,bytes32 _name, bytes32 _dataLocation) onlyOwner public {
      CandidateInfo memory newCandidate = CandidateInfo(_name, _candidate, _dataLocation);
      candidateMap[_candidate] = newCandidate;
      CandidateAdded(_candidate,_name,_dataLocation);
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

  function getCampaignData(bytes32 _campaignName)  public view returns (bytes32){
    return campaignMap[nameToCampaign[_campaignName]].ipfsLocation;
  }


  function getCampaignLogo(bytes32 _campaignName)  public view returns (bytes32){
    return nameToLogo[_campaignName];
  }

  function getListOfCampaign() public view returns(bytes32[]){
      return CampaignNameList;
  }

  function getCampaignAddress(bytes32 _campaignName) public view returns(address){
    return nameToCampaign[_campaignName];
  }



}
