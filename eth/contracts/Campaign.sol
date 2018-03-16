pragma solidity ^0.4.17;

contract CampaignFactory {
  address[] public deployedCampaigns;
    
  function createCampaign(uint minimum) public {
    address newCampanign = new Campaign(msg.sender, minimum);
    deployedCampaigns.push(newCampanign);
  }
    
  function getDeployedCampaigns() public view returns (address[]) {
    return deployedCampaigns;
  }
}

contract Campaign {
  struct Request {
    string description;
    uint value;
    address recipent;
    bool complete;
    mapping(address => bool) approvals;
    uint approvalCount;
  }
    
  address public manager;
  mapping(address => bool) public approvers;
  uint public minimumContribution;
  Request[] public requests;
  uint public approversCount;
    
  modifier managerOnly() {
    require(msg.sender == manager);
    _;
  }
    
  function Campaign(address creator, uint minimum) public {
    manager = creator;
    minimumContribution = minimum;
  }
    
  function contribute() public payable {
    require(msg.value >= minimumContribution);
    approvers[msg.sender] = true;
    approversCount++;
  }
    
  function createRequest(string description, uint value, address recipent) 
    public managerOnly 
  {
    Request memory newRequest = Request({
      description: description,
      value: value,
      recipent: recipent,
      complete: false,
      approvalCount: 0
    });
        
    requests.push(newRequest);
  }
    
  function approveRequest(uint requestIndex) public {
    require(approvers[msg.sender]);
    require(requestIndex < requests.length);
        
    Request storage request = requests[requestIndex];
        
    require(!request.approvals[msg.sender]);
        
    request.approvals[msg.sender] = true;
    request.approvalCount++;
  }
    
  function finalizeRequest(uint requestIndex) public managerOnly {
    require(requestIndex < requests.length);
        
    Request storage request = requests[requestIndex];
        
    require(request.approvalCount > (approversCount/2));
    require(!request.complete);
        
    request.recipent.transfer(request.value);
    request.complete = true;
  }

  function getSummary() public view returns (
    uint, uint, uint, uint, address
  ) {
    return (
      minimumContribution,
      this.balance,
      requests.length,
      approversCount,
      manager
    );
  }

  function getRequestsCount() public view returns (uint) {
    return requests.length;
  }
}