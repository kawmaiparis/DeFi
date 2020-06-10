pragma solidity ^0.5.1;

import "@nomiclabs/buidler/console.sol";
import "./MyCustomVaultManager.sol";


contract Negotiator {
    MyCustomVaultManager dsProxy;
    int256 agentNum = 0;
    address[] agentAddress;
    string[] agentName;

    struct Agent {
        string name;
        uint256 balance;
        bool valid;
    }

    mapping(address => Agent) Agents;

    constructor(address payable addr) public {
        dsProxy = MyCustomVaultManager(addr);
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function openAndLockETH(
        address manager,
        address jug,
        address ethJoin,
        address daiJoin,
        uint256 wadD
    ) external payable {
        dsProxy.openAndLockETH.value(msg.value)(
            manager,
            jug,
            ethJoin,
            daiJoin,
            wadD
        );
    }

    function sending() public {
        console.log("in Negotiator");
        console.log(address(this).balance);
        dsProxy.test.value(address(this).balance)();
    }

    function initAgent(string memory _name) public payable returns (uint256) {
        // require(_name == "Alice" || _name == "Bob", "Sender is not recognized");
        console.log(_name);
        Agent memory agent = Agents[msg.sender];
        agent.name = _name;
        agent.balance = 0;
        agent.valid = true;
        agentAddress.push(msg.sender);
        agentName.push(_name);
        agentNum++;

        console.log(msg.value);
        console.log(address(this).balance);
        console.log(msg.value == address(this).balance);

        return msg.value;
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

    function sendEther(address payable recipient) public {
        recipient.transfer(address(this).balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function() external payable {}
}
