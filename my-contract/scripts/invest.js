const maker = require("@studydefi/money-legos/maker");
const dappsys = require("@studydefi/money-legos/dappsys");
const erc20 = require("@studydefi/money-legos/erc20");

const MCVMinterface = require("./../artifacts/MyCustomVaultManager.json");

async function main() {
    // Build Negotiator Instance
    const provider = new ethers.providers.JsonRpcProvider();
    const privateKey =
        "0x04af278b33f044c70c09528716f9d65a3b000b9d2132b653231a94ef7eb6a71b";

    const wallet = new ethers.Wallet(privateKey, provider);
    const daiContract = new ethers.Contract(
        erc20.dai.address,
        erc20.abi,
        wallet
    );

    // Build Proxy Contract instance
    const proxyAddress = "0x808c02D1BF68616eE5EF06A2Df39cACb8Db119c2";
    const proxyContract = new ethers.Contract(
        proxyAddress,
        dappsys.dsProxy.abi,
        wallet
    );

    // Build My Contract instance
    const contractAddress = "0x83080A61498d22a2d530Dcf6DF911C4f7EeAa33D";
    const myCustomVaultManager = new ethers.Contract(
        contractAddress,
        MCVMinterface.abi,
        provider
    );

    // Prepare data for delegate call to proxy contract
    const IDssProxyActions = new ethers.utils.Interface(
        myCustomVaultManager.interface.abi
    );

    console.log("-> Performing Delgate Call...");

    const _data = IDssProxyActions.functions.myCustomOpenVaultFunction.encode([
        maker.dssCdpManager.address,
        maker.jug.address,
        maker.ethAJoin.address,
        maker.daiJoin.address,
        ethers.utils.parseUnits("20", erc20.dai.decimals),
    ]);

    const ethBefore = await await wallet.getBalance();
    const daiBefore = await daiContract.balanceOf(wallet.address);

    // Open vault through proxy
    await proxyContract.execute(myCustomVaultManager.address, _data, {
        gasLimit: 2500000,
        value: ethers.utils.parseEther("1"),
    });

    const ethAfter = await await wallet.getBalance();
    const daiAfter = await daiContract.balanceOf(wallet.address);

    const ethSpent = parseFloat(ethBefore.sub(ethAfter));
    const daiGained = parseFloat(daiAfter.sub(daiBefore));

    console.log("ethSpent: " + ethSpent);
    console.log("daiGained: " + daiGained);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
