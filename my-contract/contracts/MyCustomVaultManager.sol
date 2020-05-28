pragma solidity ^0.5.0;

import "@nomiclabs/buidler/console.sol";
import "@studydefi/money-legos/maker/contracts/DssProxyActionsBase.sol";


contract MyCustomVaultManager is DssProxyActionsBase {
    int256 agentNum = 0;
    address[] agentAddress;
    string[] agentName;

    struct Agent {
        string name;
        uint256 balance;
        bool valid;
    }

    mapping(address => Agent) Agents;

    constructor() public payable {}

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

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function checkValue() public payable returns (uint256) {
        return msg.value;
    }

    function openAndLockETH(
        address manager,
        address jug,
        address ethJoin,
        address daiJoin,
        uint256 wadD
    ) public payable {
        // Opens ETH-A CDP
        bytes32 ilk = bytes32("ETH-A");
        uint256 cdp = open(manager, ilk, address(this));

        address urn = ManagerLike(manager).urns(cdp);
        address vat = ManagerLike(manager).vat();
        // Receives ETH amount, converts it to WETH and joins it into the vat
        ethJoin_join(ethJoin, urn);
        // Locks WETH amount into the CDP and generates debt
        frob(
            manager,
            cdp,
            toInt(msg.value),
            _getDrawDart(vat, jug, urn, ilk, wadD)
        );
        // Moves the DAI amount (balance in the vat in rad) to proxy's address
        move(manager, cdp, address(this), toRad(wadD));
        // Allows adapter to access to proxy's DAI balance in the vat
        if (VatLike(vat).can(address(this), address(daiJoin)) == 0) {
            VatLike(vat).hope(daiJoin);
        }
    }
}
