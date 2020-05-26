pragma solidity ^0.5.1;

import "@nomiclabs/buidler/console.sol";


contract Negotiator {
    int256 agentNum = 0;

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

    function initAgent(string memory _name) public {
        // require(_name == "Alice" || _name == "Bob", "Sender is not recognized");
        Agent memory agent = Agents[msg.sender];
        agent.name = _name;
        agent.balance = 0;
        agent.valid = true;
        agentNum++;
    }

    function agentSatisfy() public view returns (int256) {
        return agentNum;
    }
}
