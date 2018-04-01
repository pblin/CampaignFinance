pragma solidity ^0.4.18;


/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}



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



contract ERC223Interface {
    /* This is a slight change to the ERC20 base standard.
    function totalSupply() constant returns (uint256 supply);
    is replaced with:
    uint256 public totalSupply;
    This automatically creates a getter function for the totalSupply.
    This is moved to the base contract since public getter functions are not
    currently recognised as an implementation of the matching abstract
    function by the compiler.
    */
    /// total amount of tokens
    uint256 public totalSupply;

    /// @param _owner The address from which the balance will be retrieved
    /// @return The balance
    function balanceOf(address _owner) public view returns (uint256 balance);

    /// @notice send `_value` token to `_to` from `msg.sender`
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return Whether the transfer was successful or not
    function transfer(address _to, uint256 _value) public returns (bool success);

    /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return Whether the transfer was successful or not
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);

    /// @notice `msg.sender` approves `_spender` to spend `_value` tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _value The amount of tokens to be approved for transfer
    /// @return Whether the approval was successful or not
    function approve(address _spender, uint256 _value) public returns (bool success);

    /// @param _owner The address of the account owning tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @return Amount of remaining tokens allowed to spent
    function allowance(address _owner, address _spender) public view returns (uint256 remaining);

    // solhint-disable-next-line no-simple-event-func-name
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}



contract ERC223 is ERC223Interface {

    using SafeMath for uint;

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show.
    string public symbol;                 //An identifier: eg SBX
    function ERC223(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol,
        address _owner
    ) public {
        balances[_owner] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes

    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        uint codeLength;
        assembly {
          // Retrieve the size of the code on target address, this needs assembly .
          codeLength := extcodesize(_to)
        }

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);

        Transfer(msg.sender, _to, _value);
        if(codeLength>0) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            receiver.tokenFallback(msg.sender, _value);
        }
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        uint codeLength;
        assembly {
          // Retrieve the size of the code on target address, this needs assembly .
          codeLength := extcodesize(_to)
        }
        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);

        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }

        if(codeLength>0) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            receiver.tokenFallback(_from, _value);
        }

        Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}



contract ERC223ReceivingContract {
/**
 * @dev Standard ERC223 function that will handle incoming token transfers.
 *
 * @param _from  Token sender address.
 * @param _value Amount of tokens.
 */
    function tokenFallback(address _from, uint _value);
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
    require(candidateMap[_creater].name.length != 0);
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



}






contract CampaignFund is Ownable, ERC223ReceivingContract {

    using SafeMath for uint256;

    mapping(address => uint8) private _owners;


    struct Transaction {
      address from;
      address to;
      uint amount;
      uint8 signatureCount;
      mapping (address => uint8) signatures;
    }

    mapping (uint => Transaction) public _transactions;
    uint[] public _pendingTransactions;


    uint private transactionIdx;
    uint constant MIN_SIGNATURES = 2;
    address tokenAddress;
    uint maxDonation;
    CampaignRegistry Registry;

    mapping (address => uint) ContributionTracker;

    event ownerAdded(address newOwner);
    event ownerRemoved(address deletedOwner);

    event Contribution(address contributor, address reciever, uint amount, uint timestamp);

    event transactionCreated(address campagin, address reciever, uint amount, uint timestamp);
    event TransactionCompleted(address from, address to, uint amount, uint transactionId, uint timestamp);
    event TransactionSigned(address by, uint transactionId);

    modifier validOwner() {
        require(msg.sender == owner || _owners[msg.sender] == 1);
        _;
    }


    function CampaignFund( uint _maxDonation, bytes32 _name, bytes32 _dataLocation, bytes32 _logo) public {
        Registry= CampaignRegistry(0xd8c87b36c560a1166209494b40750ee7feadf217);
        tokenAddress = 0x02e45cae489267ac75786be1d74c01768e80a8ef;
        Registry.addCampaignID(this,msg.sender,_name,_dataLocation,_logo);
        maxDonation= _maxDonation;
    }

    function addOwner(address _owner)
      onlyOwner
      public {
        _owners[owner] = 1;
        ownerAdded(_owner);
      }

    function removeOwner(address _owner)
      onlyOwner
      public {
        _owners[owner] = 0;
        ownerRemoved(_owner);
      }


    function contribute(uint _amount) public {
        require (SafeMath.add(ContributionTracker[msg.sender],_amount) <= maxDonation );
        require(Registry.isContributor(msg.sender));
        ContributionTracker[msg.sender]= SafeMath.add(ContributionTracker[msg.sender], _amount);
        require(ERC223(tokenAddress).transferFrom(msg.sender, this, _amount));

    }

    function tokenFallback(address _from, uint _value) public {
        require(Registry.isContributor(_from));
        require(SafeMath.add(ContributionTracker[_from],_value) <= maxDonation);
        Contribution(_from, this, _value, now);
    }


    function getFundBalance() public constant returns(uint256) {
        return (ERC223(tokenAddress).balanceOf(this));
    }

    function pay(address _to, uint256 _amount) onlyOwner public {
      require(Registry.isPayee(_to));
      uint _transactionId = transactionIdx++;
      Transaction memory transaction;
      transaction.from = this;
      transaction.to = _to;
      transaction.amount = _amount;
      transaction.signatureCount = 0;

      _transactions[_transactionId] = transaction;
      _pendingTransactions.push(_transactionId);
      transactionCreated(this, _to, _amount, now);
    }

    function getPendingTransactions()
      view
      public
      returns (uint[]) {
      return _pendingTransactions;
    }

    function getPendingTransactionDetail(uint transactionId) view
    public
    returns (address from, address to, uint amount){
      return (_transactions[transactionId].from,_transactions[transactionId].to,
        _transactions[transactionId].amount);
    }


    function signTransaction(uint transactionId)
      validOwner
      public {

      Transaction storage transaction = _transactions[transactionId];

      // Transaction must exist
      require(0x0 != transaction.from);
      // Cannot sign a transaction more than once
      require(transaction.signatures[msg.sender] != 1);

      transaction.signatures[msg.sender] = 1;
      transaction.signatureCount++;

      TransactionSigned(msg.sender, transactionId);

      if (transaction.signatureCount >= MIN_SIGNATURES) {
        ERC223(tokenAddress).transfer(transaction.to, transaction.amount);
        TransactionCompleted(transaction.from, transaction.to, transaction.amount, transactionId,now);
      }
    }


}
