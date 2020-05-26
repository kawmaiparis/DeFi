const bre = require("@nomiclabs/buidler");

async function main() {
    const Negotiator = await ethers.getContractFactory("Negotiator");
    const negotiator = await Negotiator.deploy();

    await negotiator.deployed();

    console.log("-> Negotiator deployed to:", negotiator.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
