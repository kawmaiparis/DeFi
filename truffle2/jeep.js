const Web3 = require("web3");

const HelloWorld = require("./build/contracts/HelloWorld.json");
// console.log(abi);

const CONTRACT_ADDRESS = "0x5c084595c6E2C15FdcdE2EF02494c880D8bA8b01";

// const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

async function callSmartContract() {
    const web3 = new Web3("http://localhost:7545");
    const id = await web3.eth.net.getId();
    const deployedNetwork = HelloWorld.networks[id];
    const contract = new web3.eth.Contract(
        HelloWorld.abi,
        deployedNetwork.address
    );

    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
        .setName("whaddup")
        .send({ from: accounts[0] });
    console.log(result);
}

callSmartContract();
