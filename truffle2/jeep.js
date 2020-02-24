const Web3 = require("web3");

const abi = require("./src/abi");
console.log(abi);
const CONTRACT_ADDRESS = "0x5c084595c6E2C15FdcdE2EF02494c880D8bA8b01";

const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

async function callSmartContract() {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();

    const contract = web3.eth.Contract(contract_abi, cotract_address);

    contract.methods.getName().call();
}

callSmartContract();
