pragma solidity ^0.5.0;

// import "./DssProxyActionsBase.sol";

// import "@nomiclabs/buidler/console.sol";

// import "@nomiclabs/buidler/console.sol";

contract GemLike {
    function approve(address, uint256) public;

    function transfer(address, uint256) public;

    function transferFrom(
        address,
        address,
        uint256
    ) public;

    function deposit() public payable;

    function withdraw(uint256) public;
}

contract ManagerLike {
    function cdpCan(
        address,
        uint256,
        address
    ) public view returns (uint256);

    function ilks(uint256) public view returns (bytes32);

    function owns(uint256) public view returns (address);

    function urns(uint256) public view returns (address);

    function vat() public view returns (address);

    function open(bytes32, address) public returns (uint256);

    function give(uint256, address) public;

    function cdpAllow(
        uint256,
        address,
        uint256
    ) public;

    function urnAllow(address, uint256) public;

    function frob(
        uint256,
        int256,
        int256
    ) public;

    function flux(
        uint256,
        address,
        uint256
    ) public;

    function move(
        uint256,
        address,
        uint256
    ) public;

    function exit(
        address,
        uint256,
        address,
        uint256
    ) public;

    function quit(uint256, address) public;

    function enter(address, uint256) public;

    function shift(uint256, uint256) public;
}

contract VatLike {
    function can(address, address) public view returns (uint256);

    function ilks(bytes32)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        );

    function dai(address) public view returns (uint256);

    function urns(bytes32, address) public view returns (uint256, uint256);

    function frob(
        bytes32,
        address,
        address,
        address,
        int256,
        int256
    ) public;

    function hope(address) public;

    function move(
        address,
        address,
        uint256
    ) public;
}

contract GemJoinLike {
    function dec() public returns (uint256);

    function gem() public returns (GemLike);

    function join(address, uint256) public payable;

    function exit(address, uint256) public;
}

contract GNTJoinLike {
    function bags(address) public view returns (address);

    function make(address) public returns (address);
}

contract DaiJoinLike {
    function vat() public returns (VatLike);

    function dai() public returns (GemLike);

    function join(address, uint256) public payable;

    function exit(address, uint256) public;
}

contract HopeLike {
    function hope(address) public;

    function nope(address) public;
}

contract EndLike {
    function fix(bytes32) public view returns (uint256);

    function cash(bytes32, uint256) public;

    function free(bytes32) public;

    function pack(uint256) public;

    function skim(bytes32, address) public;
}

contract JugLike {
    function drip(bytes32) public returns (uint256);
}

contract PotLike {
    function pie(address) public view returns (uint256);

    function drip() public returns (uint256);

    function join(uint256) public;

    function exit(uint256) public;
}

contract ProxyRegistryLike {
    function proxies(address) public view returns (address);

    function build(address) public returns (address);
}

contract ProxyLike {
    function owner() public view returns (address);
}

contract IDssProxyActions {
    function cdpAllow(
        address manager,
        uint256 cdp,
        address usr,
        uint256 ok
    ) external;

    function daiJoin_join(
        address apt,
        address urn,
        uint256 wad
    ) external;

    function draw(
        address manager,
        address jug,
        address daiJoin,
        uint256 cdp,
        uint256 wad
    ) external;

    function enter(
        address manager,
        address src,
        uint256 cdp
    ) external;

    function ethJoin_join(address apt, address urn) external;

    function exitETH(
        address manager,
        address ethJoin,
        uint256 cdp,
        uint256 wad
    ) external;

    function exitGem(
        address manager,
        address gemJoin,
        uint256 cdp,
        uint256 wad
    ) external;

    function flux(
        address manager,
        uint256 cdp,
        address dst,
        uint256 wad
    ) external;

    function freeETH(
        address manager,
        address ethJoin,
        uint256 cdp,
        uint256 wad
    ) external;

    function freeGem(
        address manager,
        address gemJoin,
        uint256 cdp,
        uint256 wad
    ) external;

    function frob(
        address manager,
        uint256 cdp,
        int256 dink,
        int256 dart
    ) external;

    function gemJoin_join(
        address apt,
        address urn,
        uint256 wad,
        bool transferFrom
    ) external;

    function give(
        address manager,
        uint256 cdp,
        address usr
    ) external;

    function giveToProxy(
        address proxyRegistry,
        address manager,
        uint256 cdp,
        address dst
    ) external;

    function hope(address obj, address usr) external;

    function lockETH(
        address manager,
        address ethJoin,
        uint256 cdp
    ) external;

    function lockETHAndDraw(
        address manager,
        address jug,
        address ethJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadD
    ) external;

    function lockGem(
        address manager,
        address gemJoin,
        uint256 cdp,
        uint256 wad,
        bool transferFrom
    ) external;

    function lockGemAndDraw(
        address manager,
        address jug,
        address gemJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC,
        uint256 wadD,
        bool transferFrom
    ) external;

    function makeGemBag(address gemJoin) external returns (address bag);

    function move(
        address manager,
        uint256 cdp,
        address dst,
        uint256 rad
    ) external;

    function nope(address obj, address usr) external;

    function open(
        address manager,
        bytes32 ilk,
        address usr
    ) external returns (uint256 cdp);

    function openLockETHAndDraw(
        address manager,
        address jug,
        address ethJoin,
        address daiJoin,
        bytes32 ilk,
        uint256 wadD
    ) external returns (uint256 cdp);

    function openLockGNTAndDraw(
        address manager,
        address jug,
        address gntJoin,
        address daiJoin,
        bytes32 ilk,
        uint256 wadC,
        uint256 wadD
    ) external returns (address bag, uint256 cdp);

    function openLockGemAndDraw(
        address manager,
        address jug,
        address gemJoin,
        address daiJoin,
        bytes32 ilk,
        uint256 wadC,
        uint256 wadD,
        bool transferFrom
    ) external returns (uint256 cdp);

    function quit(
        address manager,
        uint256 cdp,
        address dst
    ) external;

    function safeLockETH(
        address manager,
        address ethJoin,
        uint256 cdp,
        address owner
    ) external;

    function safeLockGem(
        address manager,
        address gemJoin,
        uint256 cdp,
        uint256 wad,
        bool transferFrom,
        address owner
    ) external;

    function safeWipe(
        address manager,
        address daiJoin,
        uint256 cdp,
        uint256 wad,
        address owner
    ) external;

    function safeWipeAll(
        address manager,
        address daiJoin,
        uint256 cdp,
        address owner
    ) external;

    function shift(
        address manager,
        uint256 cdpSrc,
        uint256 cdpOrg
    ) external;

    function transfer(
        address gem,
        address dst,
        uint256 wad
    ) external;

    function urnAllow(
        address manager,
        address usr,
        uint256 ok
    ) external;

    function wipe(
        address manager,
        address daiJoin,
        uint256 cdp,
        uint256 wad
    ) external;

    function wipeAll(
        address manager,
        address daiJoin,
        uint256 cdp
    ) external;

    function wipeAllAndFreeETH(
        address manager,
        address ethJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC
    ) external;

    function wipeAllAndFreeGem(
        address manager,
        address gemJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC
    ) external;

    function wipeAndFreeETH(
        address manager,
        address ethJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC,
        uint256 wadD
    ) external;

    function wipeAndFreeGem(
        address manager,
        address gemJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC,
        uint256 wadD
    ) external;
}

contract DssProxyActionsBase {
    uint256 constant RAY = 10**27;

    // Internal functions

    function Mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "Mul-overflow");
    }

    function Sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x - y) <= x, "Sub-overflow");
    }

    function toInt(uint256 x) internal pure returns (int256 y) {
        y = int256(x);
        require(y >= 0, "int-overflow");
    }

    function toRad(uint256 wad) internal pure returns (uint256 rad) {
        rad = Mul(wad, 10**27);
    }

    function convertTo18(address gemJoin, uint256 amt)
        internal
        returns (uint256 wad)
    {
        // For those collaterals that have less than 18 decimals precision we need to do the conversion before passing to frob function
        // Adapters will automatically handle the difference of precision
        wad = Mul(amt, 10**(18 - GemJoinLike(gemJoin).dec()));
    }

    // Public functions

    function daiJoin_join(
        address apt,
        address urn,
        uint256 wad
    ) public {
        // Gets DAI from the user's wallet
        DaiJoinLike(apt).dai().transferFrom(msg.sender, address(this), wad);
        // Approves adapter to take the DAI amount
        DaiJoinLike(apt).dai().approve(apt, wad);
        // Joins DAI into the vat
        DaiJoinLike(apt).join(urn, wad);
    }

    function _getDrawDart(
        address vat,
        address jug,
        address urn,
        bytes32 ilk,
        uint256 wad
    ) internal returns (int256 dart) {
        // Updates stability fee rate
        uint256 rate = JugLike(jug).drip(ilk);

        // Gets DAI balance of the urn in the vat
        uint256 dai = VatLike(vat).dai(urn);

        // If there was already enough DAI in the vat balance, just exits it without adding more debt
        if (dai < Mul(wad, RAY)) {
            // Calculates the needed dart so together with the existing dai in the vat is enough to exit wad amount of DAI tokens
            dart = toInt(Sub(Mul(wad, RAY), dai) / rate);
            // This is neeeded due lack of precision. It might need to sum an extra dart wei (for the given DAI wad amount)
            dart = Mul(uint256(dart), rate) < Mul(wad, RAY) ? dart + 1 : dart;
        }
    }

    function _getWipeDart(
        address vat,
        uint256 dai,
        address urn,
        bytes32 ilk
    ) internal view returns (int256 dart) {
        // Gets actual rate from the vat
        (, uint256 rate, , , ) = VatLike(vat).ilks(ilk);
        // Gets actual art value of the urn
        (, uint256 art) = VatLike(vat).urns(ilk, urn);

        // Uses the whole dai balance in the vat to reduce the debt
        dart = toInt(dai / rate);
        // Checks the calculated dart is not higher than urn.art (total debt), otherwise uses its value
        dart = uint256(dart) <= art ? -dart : -toInt(art);
    }

    function _getWipeAllWad(
        address vat,
        address usr,
        address urn,
        bytes32 ilk
    ) internal view returns (uint256 wad) {
        // Gets actual rate from the vat
        (, uint256 rate, , , ) = VatLike(vat).ilks(ilk);
        // Gets actual art value of the urn
        (, uint256 art) = VatLike(vat).urns(ilk, urn);
        // Gets actual dai amount in the urn
        uint256 dai = VatLike(vat).dai(usr);

        uint256 rad = Sub(Mul(art, rate), dai);
        wad = rad / RAY;

        // If the rad precision has some dust, it will need to request for 1 extra wad wei
        wad = Mul(wad, RAY) < rad ? wad + 1 : wad;
    }

    // Public functions

    function transfer(
        address gem,
        address dst,
        uint256 wad
    ) public {
        GemLike(gem).transfer(dst, wad);
    }

    function ethJoin_join(
        address apt,
        address urn,
        uint256 amount
    ) public payable {
        // Wraps ETH in WETH
        GemJoinLike(apt).gem().deposit.value(msg.value)();
        // Approves adapter to take the WETH amount
        GemJoinLike(apt).gem().approve(address(apt), msg.value);
        // Joins WETH collateral into the vat
        GemJoinLike(apt).join(urn, msg.value);
    }

    function gemJoin_join(
        address apt,
        address urn,
        uint256 wad,
        bool transferFrom
    ) public {
        // Only executes for tokens that have approval/transferFrom implementation
        if (transferFrom) {
            // Gets token from the user's wallet
            GemJoinLike(apt).gem().transferFrom(msg.sender, address(this), wad);
            // Approves adapter to take the token amount
            GemJoinLike(apt).gem().approve(apt, wad);
        }
        // Joins token collateral into the vat
        GemJoinLike(apt).join(urn, wad);
    }

    function hope(address obj, address usr) public {
        HopeLike(obj).hope(usr);
    }

    function nope(address obj, address usr) public {
        HopeLike(obj).nope(usr);
    }

    function open(
        address manager,
        bytes32 ilk,
        address usr
    ) public returns (uint256 cdp) {
        cdp = ManagerLike(manager).open(ilk, usr);
    }

    function give(
        address manager,
        uint256 cdp,
        address usr
    ) public {
        ManagerLike(manager).give(cdp, usr);
    }

    function giveToProxy(
        address proxyRegistry,
        address manager,
        uint256 cdp,
        address dst
    ) public {
        // Gets actual proxy address
        address proxy = ProxyRegistryLike(proxyRegistry).proxies(dst);
        // Checks if the proxy address already existed and dst address is still the owner
        if (proxy == address(0) || ProxyLike(proxy).owner() != dst) {
            uint256 csize;
            assembly {
                csize := extcodesize(dst)
            }
            // We want to avoid creating a proxy for a contract address that might not be able to handle proxies, then losing the CDP
            require(csize == 0, "Dst-is-a-contract");
            // Creates the proxy for the dst address
            proxy = ProxyRegistryLike(proxyRegistry).build(dst);
        }
        // Transfers CDP to the dst proxy
        give(manager, cdp, proxy);
    }

    function cdpAllow(
        address manager,
        uint256 cdp,
        address usr,
        uint256 ok
    ) public {
        ManagerLike(manager).cdpAllow(cdp, usr, ok);
    }

    function urnAllow(
        address manager,
        address usr,
        uint256 ok
    ) public {
        ManagerLike(manager).urnAllow(usr, ok);
    }

    function flux(
        address manager,
        uint256 cdp,
        address dst,
        uint256 wad
    ) public {
        ManagerLike(manager).flux(cdp, dst, wad);
    }

    function move(
        address manager,
        uint256 cdp,
        address dst,
        uint256 rad
    ) public {
        ManagerLike(manager).move(cdp, dst, rad);
    }

    function frob(
        address manager,
        uint256 cdp,
        int256 dink,
        int256 dart
    ) public {
        ManagerLike(manager).frob(cdp, dink, dart);
    }

    function quit(
        address manager,
        uint256 cdp,
        address dst
    ) public {
        ManagerLike(manager).quit(cdp, dst);
    }

    function enter(
        address manager,
        address src,
        uint256 cdp
    ) public {
        ManagerLike(manager).enter(src, cdp);
    }

    function shift(
        address manager,
        uint256 cdpSrc,
        uint256 cdpOrg
    ) public {
        ManagerLike(manager).shift(cdpSrc, cdpOrg);
    }
}

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
            // console.log("works!");
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
