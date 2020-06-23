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

    // build Bob Instance
    let provider = ethers.getDefaultProvider("kovan");
    const bobprivateKey =
        "0x05d6e90a4668fdcdfa03dcb6ac5f3f5b5e4d06070cd92a488de464e39587566b";
    const bobwallet = new ethers.Wallet(bobprivateKey, provider);
    const myCustomVaultManager = new ethers.Contract(
        "0x40577Ed667C22925f509714B307ae66B6c755c9E",
        abi,
        bobwallet
    );

    // myCustomVaultManager = myCustomVaultManager.connect(bobwallet);

    console.log(
        "Bob Balance:",
        ethers.utils.formatEther(await bobwallet.getBalance())
    );

    // Bob deposits to Contract
    let tx = await myCustomVaultManager.initAgent("Bob", {
        value: ethers.utils.parseEther("0.01"),
    });

    // tx.wait();
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
