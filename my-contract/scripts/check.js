const maker = require("@studydefi/money-legos/maker");
const dappsys = require("@studydefi/money-legos/dappsys");
const erc20 = require("@studydefi/money-legos/erc20");

async function main() {
    // deploy and create MyCustomVaultManager instance
    const MyCustomVaultManager = await ethers.getContractFactory(
        "MyCustomVaultManager"
    );
    let myCustomVaultManager = await MyCustomVaultManager.deploy();
    await myCustomVaultManager.deployed();
    console.log(
        "-> MyCustomVaultManager deployed to:",
        myCustomVaultManager.address
    );

    console.log(
        "MyCustomVaultManager Balance:",
        ethers.utils.formatEther(await myCustomVaultManager.getBalance())
    );

    // // build Bob Instance
    const provider = new ethers.providers.JsonRpcProvider();
    const bobprivateKey =
        "0x621914e8a869d3037eb5a70a61b75c29f06626f50efc1c5a3b0eea183ddb8255";
    const bobwallet = new ethers.Wallet(bobprivateKey, provider);
    myCustomVaultManager = myCustomVaultManager.connect(bobwallet);

    // Bob deposits to Contract
    await myCustomVaultManager.initAgent("Bob", {
        value: ethers.utils.parseEther("25"),
    });
    console.log(
        "MyCustomVaultManager Balance:",
        ethers.utils.formatEther(await myCustomVaultManager.getBalance())
    );

    // ---------------------------- DEPLOYING PROXY -----------------------------
    // We need some account with some gas to deploy the proxy initially - this won't matter later.
    // Okay, so Alice (or Bob) has to sign the initil contract but, in theory, i should be able to change the contract's logic to use its value instead of Alice's
    const privateKey =
        "0x601204dab00e8efda5545dad1bd586f79b9e62f66fce4da6661bc259dcb6e3f3"; // just some account

    const wallet = new ethers.Wallet(privateKey, provider);
    const daiContract = new ethers.Contract(
        erc20.dai.address,
        erc20.abi,
        wallet
    );

    const proxyRegistry = new ethers.Contract(
        maker.proxyRegistry.address,
        maker.proxyRegistry.abi,
        wallet
    );

    // Build proxy if we don't have one
    let proxyAddress = await proxyRegistry.proxies(wallet.address);
    if (proxyAddress === "0x0000000000000000000000000000000000000000") {
        console.log("building proxy...");
        await proxyRegistry.build({
            gasLimit: 1500000,
        });
        proxyAddress = await proxyRegistry.proxies(wallet.address);
    }

    console.log("-> Proxy registry deployed to:", proxyAddress);

    // ------------------------------ CALLING MY CONTRACT --------------------------------

    // Build Contract instance
    const proxyContract = new ethers.Contract(
        proxyAddress,
        dappsys.dsProxy.abi,
        wallet
    );

    // Prepare data for delegate call
    const ProxyActions = new ethers.utils.Interface(
        myCustomVaultManager.interface.abi
    );

    console.log("-> Performing Delgate Call...");

    // Encode parameters
    const _data = ProxyActions.functions.myCustomOpenVaultFunction.encode([
        maker.dssCdpManager.address,
        maker.jug.address,
        maker.ethAJoin.address,
        maker.daiJoin.address,
        ethers.utils.parseUnits("20", erc20.dai.decimals),
    ]);

    // Balance before function call
    // const ethBefore = await await wallet.getBalance();
    // const daiBefore = await daiContract.balanceOf(wallet.address);

    // Open vault through proxy
    await proxyContract.execute(myCustomVaultManager.address, _data, {
        gasLimit: 2500000,
        // value: ethers.utils.parseEther("25"),
    });

    // Balance after function call
    // const ethAfter = await await wallet.getBalance();
    // const daiAfter = await daiContract.balanceOf(wallet.address);

    // const ethSpent = parseFloat(ethBefore.sub(ethAfter));
    // const daiGained = parseFloat(daiAfter.sub(daiBefore));

    // console.log("ethSpent: " + ethSpent);
    // console.log("daiGained: " + daiGained);

    console.log(
        "MyCustomVaultManager Balance:",
        ethers.utils.formatEther(await myCustomVaultManager.getBalance())
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
