const chalk = require("chalk");
const abi = require("./../artifacts/MyCustomVaultManager.json");
const ethers = require("ethers");
const bobPrivateKey =
    "0x8a9d16d5aee4cc35c090f2d0fe6e6c8e57cf658048ce631dbbea0fe550bc77cd";
const contract_address = "0x40577Ed667C22925f509714B307ae66B6c755c9E";

// id mapping for mutlple proposals -> concurrency

let latestProposal = 0;
let hasProposed = false;
let proposalIsAccepted = false;

function handleCommand(data) {
    switch (data[0]) {
        case "deposit":
            console.log("Making deposit");
            const contract = new ethers.Contract(
                contract_address,
                abi,
                bobPrivateKey
            );
            await contract.deposit("Alice", {
                value: ethers.utils.parseEther(data[1]),
            });
            break;
        case "withdraw":
            console.log("calling withdraw function");
            const contract = new ethers.Contract(
                contract_address,
                abi,
                bobPrivateKey
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
