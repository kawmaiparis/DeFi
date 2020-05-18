const { legos } = require("@studydefi/money-legos");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

const wallet = new ethers.Wallet(
    "0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773", // Default private key for ganache-cli -d
    provider
);

const wethContract = new ethers.Contract(
    legos.erc20.weth.address,
    legos.erc20.weth.abi,
    wallet
);

const main = async () => {
    await wethContract.deposit({
        value: ethers.utils.parseEther("1.0"),
        gasLimit: 1000000,
    });

    const wethBal = await wethContract.balanceOf(wallet.address);

    console.log(`WETH Balance: ${ethers.utils.formatEther(wethBal)}`);
};

main();
