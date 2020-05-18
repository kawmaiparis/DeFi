pragma solidity >=0.4.21 <0.7.0;

import "./B.sol";


contract A {
    // 1. call funtion of other contract
    // 2. import keyword
    // 3. contract interface
    // 4. error propagation

    // 1. interface of B -> B - already in the same file
    // 2. address of B

    address addressB;

    function setAddressB(address _addressB) external {
        addressB = _addressB;
    }

    function callHelloWorld() external view returns (string memory) {
        B b = B(addressB);
        return b.helloWorld();
    }
}
