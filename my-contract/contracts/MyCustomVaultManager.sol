pragma solidity ^0.5.0;

import "@nomiclabs/buidler/console.sol";
import "@studydefi/money-legos/maker/contracts/DssProxyActionsBase.sol";


contract MyCustomVaultManager is DssProxyActionsBase {
    struct Agent {
        string name;
        uint256 balance;
        bool valid;
    }

    mapping(address => Agent) Agents;

    function initAgent(address _address, string memory _name) public {
        Agent memory agent = Agents[_address];
        agent.name = _name;
        agent.balance = 0;
        agent.valid = true;
    }

    function greet() public view returns (string memory) {
        console.log("hello");
        return "returned hello";
    }

    // deposit function for Alice and Bob to pay the contract
    function depositETH(uint256 wadD) public payable {
        require(msg.value == wadD);
        if (Agents[msg.sender].valid) {
            // address(this).transfer(wadD);
            // Agents[msg.sender].balance = wadD;
        }
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function getBalance() public returns (uint256 ret) {
        if (Agents[msg.sender].valid) {
            return Agents[msg.sender].balance;
        }
        return 0;
    }

    // deposit function HERE!

    function myCustomOpenVaultFunction(
        address manager,
        address jug,
        address ethJoin,
        address daiJoin,
        uint256 wadD
    ) public payable {
        // check if Alice and Bob have deposited? mappings accounts -> balance

        console.log("hi");
        console.log(manager);
        console.log(jug);
        console.log(ethJoin);
        console.log(daiJoin);
        console.log(wadD);

        // Opens ETH-A CDP
        bytes32 ilk = bytes32("ETH-A");
        uint256 cdp = open(manager, ilk, address(this));

        address urn = ManagerLike(manager).urns(cdp);
        address vat = ManagerLike(manager).vat();
        // Receives ETH amount, converts it to WETH and joins it into the vat
        ethJoin_join(ethJoin, urn);
        // Locks WETH amount into the CDP and generates debt

        // change msg.value to the sum of Alice and Bob's balances
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

        // Exits DAI to the user's wallet as a token
        DaiJoinLike(daiJoin).exit(msg.sender, wadD);
    }
}
