const maker = require("@studydefi/money-legos/maker");
const dappsys = require("@studydefi/money-legos/dappsys");
const erc20 = require("@studydefi/money-legos/erc20");

// install (mostly) all dependencies
// npm install --save-dev @nomiclabs/buidler-ethers ethers @nomiclabs/buidler-waffle ethereum-waffle chai

// FORK MY INFURA (broken atm)
// npx ganache-cli -f https://mainnet.infura.io/v3/b58b6c88761446ec82f70ebc965c90e8 -i 1

// FORK ETHER JS INFURA
// npx ganache-cli -f https://mainnet.infura.io/v3/7d0d81d0919f4f05b9ab6634be01ee73 -i 1

// SPAWN LOCAL NODE
// npx buidler node

async function main() {
    // ---------------------------- DEPLOY MY CONTRACT -------------------------------
    const MyCustomVaultManager = await ethers.getContractFactory(
        "MyCustomVaultManager"
    );
    const myCustomVaultManager = await MyCustomVaultManager.deploy();

    await myCustomVaultManager.deployed();

    console.log(
        "  MyCustomVaultManager deployed to:",
        myCustomVaultManager.address
    );
    console.log("");

    // ---------------------------- DEPLOYING PROXY -------------------------------

    const provider = new ethers.providers.JsonRpcProvider();
    const privateKey =
        "0x04d9096296be352b4cd0de36da9a65f0f7947f935484d40fdae8dbe8bc50418d";

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
        await proxyRegistry.build({ gasLimit: 1500000 });
        proxyAddress = await proxyRegistry.proxies(wallet.address);
    }

    console.log("  DSProxy deployed to Maker's Proxy Registry");
    console.log("");

    // ------------------------------ CALLING MY CONTRACT --------------------------------

    // Build Contract instance
    const proxyContract = new ethers.Contract(
        proxyAddress,
        dappsys.dsProxy.abi,
        wallet
    );

    // Prepare data for delegate call -> CHANGE TO USE MY CONTRACT!
    const IDssProxyActions = new ethers.utils.Interface(
        myCustomVaultManager.interface.abi
    );

    console.log("  Performing Delgate Call...");
    console.log("  -> Locking 1 ETH and Drawing 20 DAI");
    console.log("");

    const _data = IDssProxyActions.functions.openAndLockETH.encode([
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

    console.log("  ethSpent: " + ethSpent);
    console.log("  daiGained: " + daiGained);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
