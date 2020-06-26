const chalk = require("chalk");
const abi = require("./../artifacts/MyCustomVaultManager.json");
const ethers = require("ethers");
const alicePrivateKey =
"0x04d9096296be352b4cd0de36da9a65f0f7947f935484d40fdae8dbe8bc50418d";
const contract_address = "0x40577Ed667C22925f509714B307ae66B6c755c9E";

// id mapping for mutlple proposals -> concurrency

let latestProposal = 0;
let hasProposed = false;
let proposalIsAccepted = false;

function handleCommand(data) {
    switch (data[0]) {
        case "deposit":
            console.log("Making deposit");

            const provider = ethers.getDefaultProvider("kovan");
            const contract = new ethers.Contract(
                contract_address,
                abi,
                alicePrivateKey
            );
            await contract.deposit("Alice", {
                value: ethers.utils.parseEther(data[1]),
            });
            break;
        case "withdraw":
            console.log("calling withdraw function");
            const provider = ethers.getDefaultProvider("kovan");
            const contract = new ethers.Contract(
                contract_address,
                abi,
                alicePrivateKey
            );
            await contract.wipeAllAndFreeETH();
            break;
        case "propose":
            console.log(
                "An agent has proposed",
                chalk.red.bold(data[1]),
                "(ETH)"
            );
            hasProposed = true;
            latestProposal = data[1];
            break;
        case "accept":
            if (!hasProposed) {
                console.error("-> The peer was accepting a blank propsal");
                return;
            }
            console.log("Proposal", chalk.red.bold("accepted"));
            proposalIsAccepted = true;
            hasProposed = false;
            return 1;
            break;
        case "reject":
            if (!hasProposed) {
                console.error("-> The peer was rejecting a blank propsal");
                return;
            }
            console.log("Proposal", chalk.red.bold("rejected"));
            hasProposed = false;
            latestProposal = 0;
            proposalIsAccepted = false;
            return -1;
            break;
        default:
            console.log("Invalid commands deteced in handleCommand");
            break;
    }
}
module.exports = {
    handleCommand,
};
