const bre = require("@nomiclabs/buidler");
const maker = require("@studydefi/money-legos/maker");
const dappsys = require("@studydefi/money-legos/dappsys");
const erc20 = require("@studydefi/money-legos/erc20");

const interface = require("./../artifacts/Negotiator.json");

async function main() {
    // deploy and create MyCustomVaultManager instance
    const Negotiator = await ethers.getContractFactory("Negotiator");
    let negotiator = await Negotiator.deploy();
    await negotiator.deployed();
    console.log("-> Negotiator deployed to:", negotiator.address);

    // contract = (address, abi, signer/provider)
    const address = "0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F";
    const provider = new ethers.providers.JsonRpcProvider();
    const privateKey =
        "0x28d1bfbbafe9d1d4f5a11c3c16ab6bf9084de48d99fbac4058bdfa3c80b2908f";

    // const privateKey =
    //     "0x28d1bfbbafe9d1d4f5a11c3c16ab6bf9084de48d99fbac4058bdfa3c80b2908e";

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = negotiator.connect(wallet);
    console.log(await contract.getContractAddress());
    console.log("Wallet:", ethers.utils.formatEther(await wallet.getBalance()));
    console.log(
        "Balance:",
        ethers.utils.formatEther(await contract.getBalance())
    );

    let tx = await contract.initAgent("Bobs", {
        value: ethers.utils.parseEther("25"),
    });

    await tx.wait();

    console.log("Wallet:", ethers.utils.formatEther(await wallet.getBalance()));
    console.log(
        "Balance:",
        ethers.utils.formatEther(await contract.getBalance())
    );
    await contract.sendEther(wallet.address);

    // await contract.printAllAgents();
    console.log("Wallet:", ethers.utils.formatEther(await wallet.getBalance()));
    console.log(
        "Balance:",
        ethers.utils.formatEther(await contract.getBalance())
    );
    // console.log("Contract Balance: " + (await contract.getBalance()));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
