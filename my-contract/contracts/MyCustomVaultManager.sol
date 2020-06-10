pragma solidity ^0.5.0;

import "./DssProxyActionsBase.sol";
import "@nomiclabs/buidler/console.sol";


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
            // console.log(agentName[i]);
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
        // console.log("msg value:", msg.value);
        // console.log("balanace:", address(this).balance);
        return address(this).balance;
    }

    function checkValue() public payable returns (uint256) {
        return msg.value;
    }

    function test() public payable {
        // console.log("In MyCustomVaultManger");
        // console.log(msg.value);
    }

    function getHi() public view returns (uint256) {
        return 0;
    }

    function check() public payable returns (uint256) {
        require(20000000000000000000 == address(this).balance, "YO WHADDUP");
        if (20000000000000000000 == address(this).balance) {
            console.log("works!");
        }
        return 0;
    }

    function openAndLockETH(
        address manager,
        address jug,
        address ethJoin,
        address daiJoin,
        uint256 wadD
    ) public payable returns (uint256) {
        // Opens ETH-A CDP

        bytes32 ilk = bytes32("ETH-A");
        uint256 cdp = open(manager, ilk, address(this));

        address urn = ManagerLike(manager).urns(cdp);
        address vat = ManagerLike(manager).vat();
        // Receives ETH amount, converts it to WETH and joins it into the vat
        ethJoin_join(ethJoin, urn, address(this).balance);
        // Locks WETH amount into the CDP and generates debt
        frob(
            manager,
            cdp,
            toInt(address(this).balance),
            _getDrawDart(vat, jug, urn, ilk, wadD)
        );
        // Moves the DAI amount (balance in the vat in rad) to proxy's address
        move(manager, cdp, address(this), toRad(wadD));
        // Allows adapter to access to proxy's DAI balance in the vat
        if (VatLike(vat).can(address(this), address(daiJoin)) == 0) {
            VatLike(vat).hope(daiJoin);
        }

        // Exits DAI to the user's wallet as a token
        DaiJoinLike(daiJoin).exit(msg.sender, wadD);
    }

    function wipeAllAndFreeETH(
        address manager,
        address ethJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC
    ) public {
        address vat = ManagerLike(manager).vat();
        address urn = ManagerLike(manager).urns(cdp);
        bytes32 ilk = ManagerLike(manager).ilks(cdp);
        (, uint256 art) = VatLike(vat).urns(ilk, urn);

        // Joins DAI amount into the vat
        daiJoin_join(daiJoin, urn, _getWipeAllWad(vat, urn, urn, ilk));
        // Paybacks debt to the CDP and unlocks WETH amount from it
        frob(manager, cdp, -toInt(wadC), -int256(art));
        // Moves the amount from the CDP urn to proxy's address
        flux(manager, cdp, address(this), wadC);
        // Exits WETH amount to proxy address as a token
        GemJoinLike(ethJoin).exit(address(this), wadC);
        // Converts WETH to ETH
        GemJoinLike(ethJoin).gem().withdraw(wadC);
        // Sends ETH back to the user's wallet
        msg.sender.transfer(wadC);
    }

    function() external payable {}
}
