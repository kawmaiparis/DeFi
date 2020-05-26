const bre = require("@nomiclabs/buidler");
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
        "-> MyCustomVaultManager deployed to:",
        myCustomVaultManager.address
    );

    // ---------------------------- DEPLOYING PROXY -------------------------------

    const provider = new ethers.providers.JsonRpcProvider();
    const privateKey =
        "0x51c1aec0a603dab997dbcbaae83f071ad9d584999e1000a2b655698ed603da7c";

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

    console.log("-> Proxy registry deployed!");

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

    console.log("-> Performing Delgate Call...");

    const _data = IDssProxyActions.functions.getContractAddress.encode([]);

    // Open vault through proxy
    const ret = await proxyContract.execute(
        myCustomVaultManager.address,
        _data,
        {
            gasLimit: 2500000,
            value: ethers.utils.parseEther("1"),
        }
    );

    console.log(ret);
    console.log("--- done ---");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
