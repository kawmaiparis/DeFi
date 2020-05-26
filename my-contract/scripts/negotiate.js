const bre = require("@nomiclabs/buidler");
const maker = require("@studydefi/money-legos/maker");
const dappsys = require("@studydefi/money-legos/dappsys");
const erc20 = require("@studydefi/money-legos/erc20");

const interface = require("./../artifacts/Negotiator.json");

async function main() {
    // contract = (address, abi, signer/provider)
    const address = "0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F";
    const provider = new ethers.providers.JsonRpcProvider();
    const privateKey =
        "0x28d1bfbbafe9d1d4f5a11c3c16ab6bf9084de48d99fbac4058bdfa3c80b2908f";

    const wallet = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(address, interface.abi, wallet);

    console.log(await contract.getContractAddress());
    console.log(await contract.agentSatisfy());

    console.log(await contract.initAgent("Alice"));

    console.log(await contract.agentSatisfy());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
