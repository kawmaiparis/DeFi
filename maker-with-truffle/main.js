const Web3 = require("web3");

const HelloWorld = require("./build/contracts/HelloWorld.json");
const A = require("./build/contracts/A.json");
const B = require("./build/contracts/B.json");

const CONTRACT_ADDRESS = "0x5c084595c6E2C15FdcdE2EF02494c880D8bA8b01";
const A_ADDRESS = "0x19A19adF21dd671Ae4b5862bC17841C0a76bEA9C";
const B_ADDRESS = "0x19A19adF21dd671Ae4b5862bC17841C0a76bEA9C";

// const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

// https://github.com/makerdao/proxy-registry
// https://github.com/makerdao/mcd-cdp-portal
// https://etherscan.io/tx/0x736ab50a6b3634b97e936fa878dcb699f13d0e72cd1d55d26da8d43a2f3b2104
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
        .setName("hello")
        .send({ from: accounts[0] });
    console.log(result);
}

async function callA() {
    const web3 = new Web3("http://localhost:7545");
    const id = await web3.eth.net.getId();
    const deployedNetwork = A.networks[id];
    const contract = new web3.eth.Contract(A.abi, deployedNetwork.address);
    console.log("eh");

    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
        .callHelloWorld()
        .send({ from: accounts[0] });
    console.log(result);
}

async function callB() {
    const web3 = new Web3("http://localhost:7545");
    const id = await web3.eth.net.getId();
    const deployedNetwork = B.networks[id];
    const contract = new web3.eth.Contract(B.abi, deployedNetwork.address);
    console.log("eh");

    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
        .helloWorld()
        .send({ from: accounts[0] });
    console.log(result);
}

callA();
// callSmartContract();
