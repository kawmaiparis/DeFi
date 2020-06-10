usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@nomiclabs/buidler-web3");
usePlugin("@nomiclabs/buidler-ethers");

const INFURA_PROJECT_URL =
    "https://kovan.infura.io/v3/7d0d81d0919f4f05b9ab6634be01ee73";

const KOVAN_PRIVATE_KEY =
    "0x05d6e90a4668fdcdfa03dcb6ac5f3f5b5e4d06070cd92a488de464e39587566b";

task("accounts", "Prints the list of accounts", async () => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(await account.getAddress());
    }
});

task("balance", "Prints an account's balance")
    .addParam("account", "The account's address")
    .setAction(async (taskArgs) => {
        const account = web3.utils.toChecksumAddress(taskArgs.account);
        const balance = await web3.eth.getBalance(account);

        console.log(web3.utils.fromWei(balance, "ether"), "ETH");
    });

module.exports = {
    solc: {
        version: "0.5.15",
    },
    networks: {
        localhost: {
            timeout: 0,
        },
        kovan: {
            url: INFURA_PROJECT_URL,
            accounts: [KOVAN_PRIVATE_KEY],
        },
    },
};
