const maker = require("@studydefi/money-legos/maker");
const dappsys = require("@studydefi/money-legos/dappsys");
const erc20 = require("@studydefi/money-legos/erc20");

async function main() {
    // deploy and create MyCustomVaultManager instance
    console.log("hello");
    const MyCustomVaultManager = await ethers.getContractFactory(
        "MyCustomVaultManager"
    );
    let myCustomVaultManager = await MyCustomVaultManager.deploy();
    await myCustomVaultManager.deployed();
    console.log(
        "-> MyCustomVaultManager deployed to:",
        myCustomVaultManager.address
    );

    const provider = new ethers.providers.JsonRpcProvider();
    const bobprivateKey =
        "0x28d1bfbbafe9d1d4f5a11c3c16ab6bf9084de48d99fbac4058bdfa3c80b2908f";
    const bobwallet = new ethers.Wallet(bobprivateKey, provider);
    myCustomVaultManager = myCustomVaultManager.connect(bobwallet);

    let tx = await myCustomVaultManager.initAgent("Bob", {
        value: ethers.utils.parseEther("20"),
    });

    console.log(
        "MyCustomVaultManager Balance:",
        await myCustomVaultManager.openAndLockETH(
            maker.dssCdpManager.address,
            maker.jug.address,
            maker.ethAJoin.address,
            maker.daiJoin.address,
            ethers.utils.parseUnits("25", erc20.dai.decimals)
        )
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
