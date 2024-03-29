const { ethers } = require("ethers");
const Ganache = require("ganache-core");

const MAINNET_NODE_URL =
    "https://mainnet.infura.io/v3/b58b6c88761446ec82f70ebc965c90e8";
const PRIV_KEY = "41745d4c75444e8487e97ea7ee47e059";

const startChain = async () => {
    const ganache = Ganache.provider({
        fork: MAINNET_NODE_URL,
        network_id: 1,
        accounts: [
            {
                secretKey: PRIV_KEY,
                balance: ethers.utils.hexlify(ethers.utils.parseEther("1000")),
            },
        ],
    });

    const provider = new ethers.providers.Web3Provider(ganache);
    const wallet = new ethers.Wallet(PRIV_KEY, provider);

    return wallet;
};

const erc20 = require("@studydefi/money-legos/erc20");

describe("do some tests", () => {
    let wallet;

    beforeAll(async () => {
        wallet = await startChain();
    });

    test("initial DAI balance of 0", async () => {
        const daiContract = new ethers.Contract(
            erc20.dai.address,
            erc20.dai.abi,
            wallet
        );
        const daiBalanceWei = await daiContract.balanceOf(wallet.address);
        const daiBalance = ethers.utils.formatUnits(daiBalanceWei, 18);
        expect(parseFloat(daiBalance)).toBe(0);
    });

    test("initial ETH balance of 1000 ETH", async () => {
        const ethBalanceWei = await wallet.getBalance();
        const ethBalance = ethers.utils.formatEther(ethBalanceWei);
        expect(parseFloat(ethBalance)).toBe(1000);
    });
});
