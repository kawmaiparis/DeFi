pragma solidity ^0.5.1;

import "@nomiclabs/buidler/console.sol";


contract Negotiator {
    int256 agentNum = 0;
    address[] agentAddress;
    string[] agentName;

    struct Agent {
        string name;
        uint256 balance;
        bool valid;
    }

    mapping(address => Agent) Agents;

    constructor() public {
        console.log("Deploying a Negotiator");
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function initAgent(string memory _name) public payable {
        // require(_name == "Alice" || _name == "Bob", "Sender is not recognized");
        console.log(_name);
        Agent memory agent = Agents[msg.sender];
        agent.name = _name;
        agent.balance = 0;
        agent.valid = true;
        agentAddress.push(msg.sender);
        agentName.push(_name);
        agentNum++;
    }

    function printAllAgents() public view {
        for (uint256 i = 0; i < agentName.length; i++) {
            console.log(agentName[i]);
        }
    }

    function deleteAgent() public {
        delete Agents[msg.sender];
        // have to find delete from agentAddress as well
        // lets worry about that later
    }

    function agentSatisfy() public view returns (int256) {
        return agentNum;
    }

    function sendEther(address payable recipient) external {
        recipient.transfer(1 ether);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
