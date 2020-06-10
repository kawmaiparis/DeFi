const ethers = require("ethers");
const CONTRACT_ADDRESS = "0x5dE461a0F2b0DE4CCEaF2b607cfE083782aA1117";
const CONTRACT_ABI = require("./../artifacts/MyCustomVaultManager.json");

async function depositToContract(privateKey, amount, name) {
    // build Bob Instance
    const provider = new ethers.providers.JsonRpcProvider();

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI.abi,
        wallet
    );

    console.log(
        "Contract Balance before:",
        ethers.utils.formatEther(await contract.getBalance())
    );

    await contract.initAgent(name, {
        value: ethers.utils.parseEther(amount),
    });

    console.log(
        "Contract Balance after:",
        ethers.utils.formatEther(await contract.getBalance())
    );
}
module.exports = {
    depositToContract,
};
