const maker = require("@studydefi/money-legos/maker");
const dappsys = require("@studydefi/money-legos/dappsys");
const erc20 = require("@studydefi/money-legos/erc20");
const proxy_registry_abi = require("./../kovan_artifacts/Proxy_Registry.json");
const abi = require("./MyABI.json");

async function main() {
    // deploy and create MyCustomVaultManager instance
    const MyCustomVaultManager = await ethers.getContractFactory(
        "MyCustomVaultManager"
    );
    let myCustomVaultManager = await MyCustomVaultManager.deploy(0.02);
    await myCustomVaultManager.deployed();
    console.log(
        "-> MyCustomVaultManager deployed to:",
        myCustomVaultManager.address
    );

    console.log(
        "MyCustomVaultManager Balance:",
        ethers.utils.formatEther(await myCustomVaultManager.getBalance())
    );

    // build Bob Instance
    const provider = new ethers.providers.JsonRpcProvider();
    // let provider = ethers.getDefaultProvider("kovan");
    // const bobprivateKey =
    //     "0x05d6e90a4668fdcdfa03dcb6ac5f3f5b5e4d06070cd92a488de464e39587566b";
    const bobprivateKey =
        "0x8a9d16d5aee4cc35c090f2d0fe6e6c8e57cf658048ce631dbbea0fe550bc77cd";
    const bobwallet = new ethers.Wallet(bobprivateKey, provider);
    // const myCustomVaultManager = new ethers.Contract(
    //     "0x40577Ed667C22925f509714B307ae66B6c755c9E",
    //     abi,
    //     bobwallet
    // );

    myCustomVaultManager = myCustomVaultManager.connect(bobwallet);

    console.log(
        "Bob Balance:",
        ethers.utils.formatEther(await bobwallet.getBalance())
    );

    // Bob deposits to Contract
    let tx = await myCustomVaultManager.deposit("Bob", {
        value: ethers.utils.parseEther("0.01"),
    });

    // tx.wait();
    console.log(
        "MyCustomVaultManager Balance:",
        ethers.utils.formatEther(await myCustomVaultManager.getBalance())
    );

    // ---------------------------- DEPLOYING PROXY -----------------------------
    // We need some account with some gas to deploy the proxy initially - this won't matter later.
    // const privateKey =
    //     "0x05d6e90a4668fdcdfa03dcb6ac5f3f5b5e4d06070cd92a488de464e39587566b";
    const privateKey =
        "0x04d9096296be352b4cd0de36da9a65f0f7947f935484d40fdae8dbe8bc50418d"; // just some account

    const wallet = new ethers.Wallet(privateKey, provider);
    const daiContract = new ethers.Contract(
        erc20.dai.address,
        erc20.abi,
        wallet
    );

    // -- for Kovan --
    // maker.proxyRegistry.address = "0x64A436ae831C1672AE81F674CAb8B6775df3475C";
    // maker.dssCdpManager.address = "0x1476483dD8C35F25e568113C5f70249D3976ba21";
    // maker.jug.address = "0xcbB7718c9F39d05aEEDE1c472ca8Bf804b2f1EaD";
    // maker.ethAJoin.address = "0x775787933e92b709f2a3C70aa87999696e74A9F8";
    // maker.daiJoin.address = "0x5AA71a3ae1C0bd6ac27A1f28e1415fFFB6F15B8c";
    // maker.proxyRegistry.abi = proxy_registry_abi;

    const proxyRegistry = new ethers.Contract(
        maker.proxyRegistry.address,
        maker.proxyRegistry.abi,
        wallet
    );

    // Build Maker proxy if we don't have one
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

    console.log("performing Delegate Call...");

    // Encode parameters
    const _data = ProxyActions.functions.openAndLockETH.encode([
        maker.dssCdpManager.address,
        maker.jug.address,
        maker.ethAJoin.address,
        maker.daiJoin.address,
        ethers.utils.parseUnits("0.01", erc20.dai.decimals),
    ]);

    // Balance before function call
    const ethBefore = await await wallet.getBalance();
    // const daiBefore = await daiContract.balanceOf(wallet.address);

    // Open vault through proxy
    await proxyContract.execute(myCustomVaultManager.address, _data, {
        gasLimit: 5000000,
        value: ethers.utils.parseUnits("25", erc20.dai.decimals),
    });

    // Balance after function call
    const ethAfter = await await wallet.getBalance();
    const daiAfter = await daiContract.balanceOf(wallet.address);

    const ethSpent = parseFloat(ethBefore.sub(ethAfter));
    const daiGained = parseFloat(daiAfter.sub(daiBefore));

    console.log("ethSpent: " + ethSpent);
    console.log("daiGained: " + daiGained);

    console.log(
        "MyCustomVaultManager Balance:",
        ethers.utils.formatEther(await myCustomVaultManager.getBalance())
    );

    console.log(
        "Bob Balance:",
        ethers.utils.formatEther(await bobwallet.getBalance())
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
