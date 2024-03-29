pragma solidity ^0.5.1;

import "@nomiclabs/buidler/console.sol";


contract Greeter {
    string greeting;

    constructor(string memory _greeting) public {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        console.log("printing from contract");
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }
}
