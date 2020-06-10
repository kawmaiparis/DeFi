const chalk = require("chalk");

// id mapping for mutlple proposals -> concurrency

let latestProposal = 0;
let hasProposed = false;
let proposalIsAccepted = false;

function handleCommand(data) {
    switch (data[0]) {
        case "deposit":
            console.log("calling deposit function");
            break;
        case "withdraw":
            console.log("calling withdraw function");
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
            // if (!hasProposed) {
            //     console.log("-> The peer was accepting a blank propsal");
            //     return;
            // }
            console.log("Proposal", chalk.red.bold("accepted"));
            proposalIsAccepted = true;
            hasProposed = false;
            return 1;
            break;
        case "reject":
            // if (!hasProposed) {
            //     console.log("-> The peer was rejecting a blank propsal");
            //     return;
            // }
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
