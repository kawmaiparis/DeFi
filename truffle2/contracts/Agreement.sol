pragma solidity >=0.4.21 <0.7.0;


contract Agreement {
    bool private alice_committed = false;
    bool private bob_committed = false;

    int256 private balance = 0;

    address alice_address;
    address bob_address;

    constructor(address _bob) public {
        alice_address = msg.sender;
        bob_address = _bob;
    }

    // Precondition G
    function deposit() public payable returns (int256) {
        require(
            msg.sender == alice_address || msg.sender == bob_address,
            "Sender must only be Alice or Bob"
        );
        require(msg.value > 1, "Sender must have at least 1ETH"); // not sure if WEI == ETH?

        if (msg.sender == alice_address) {
            alice_committed = true;
        }
        if (msg.sender == bob_address) {
            bob_committed = true;
        }

        // call deposit api here and return the balance

        return 1;
    }

    // function invest() public payable returns (int256) {
    //     require(alice_committed && bob_committed, "Require both Alice and Bob to deposit");

    //     // open a cdp
    // 	maker_contract.open_cdp();
    // 	// deposit the ETH with the contract's balance
    // 	maker_contract.deposit(self.balance);
    // 	// generate the Daiw
    // 	maker_contract.draw_dai(150);
    // 	// deposit Dai into the DSR
    // 	maker_contract.deposit_dsr(150);
    //     return 1;

    // }

    // function exit() public payable returns (int256) {
    //     require(alice_committed && bob_committed, "Require both Alice and Bob to desposit")

    //     // // check if profit is high enough to exit
    // 	// uint current_profit = maker_contract.get_dai_return();
    // 	// require(current_profit > 5);

    // 	// // leave maker
    // 	// maker_contract.exit_dsr();
    // 	// maker_contract.exit_cdp();
    // 	// // at this point we get the 2 ETH we have deposited plus the 5 Dai profit
    // 	// // transfer money to alice and bob
    // 	// alice.transfer(1 ETH);
    // 	// alice.transfer(2.5 Dai);
    // 	// bob.transfer(1 ETH);
    // 	// bob.transfer(2.5 Dai);
    // }

    function Balance() public view returns (int256) {
        return balance;
    }
}
