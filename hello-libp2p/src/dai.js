const Maker = require("@makerdao/dai");
const Web3 = require("web3");
const fs = require("fs");

const { MKR, DAI, ETH, WETH, PETH, USD_ETH, USD_MKR, USD_DAI } = Maker;
/* account 4 */
const PRIVATE_KEY =
    "0xc43157decd59dc8a29ade4a219ee3ce61672eb3c32f27810a1dca59e7c7661ae";

const URL = "https://kovan.infura.io/v3/b839d484af444e308e098f46555e0260";

// test function
async function hello() {
    console.log("hello!");
}

async function invest(PRIVATE_KEY, EthToDeposit, DaiToDraw) {
    try {
        // const maker = await Maker.create("http", {
        //     privateKey: PRIVATE_KEY,
        //     url: URL
        // });

        const maker = await Maker.create("test", {
            privateKey: PRIVATE_KEY,
            url: "http://127.0.0.1:7545"
        });

        // const dai = maker.service("token").getToken("DAI");

        // this sometimes fail for unknown reason...
        // await maker.authenticate();

        console.log("  opening CDP");
        const cdp = await maker.openCdp();
        console.log(cdp);

        console.log("  locking Eth");
        await cdp.lockEth(EthToDeposit);

        // const balance = await dai.balanceOf(defaultAccount);

        // console.log("Dai balance before drawing:", balance.toString());

        console.log("  drawing DAI");
        const txn = await cdp.drawDai(DaiToDraw);
        // console.log("Amount Drawn:", txn);

        // balance = await dai.balanceOf(defaultAccount);
        // console.log("Dai balance after drawing:", balance.toString());

        const debt = await cdp.getDebtValue();
        console.log(debt); // '1.00 DAI'

        console.log("  Invest done!");
        return cdp;
    } catch (err) {
        console.log("  Something went wrong");
        console.log(err);
    }
}

async function payback(PRIVATE_KEY, DaiToPay) {
    try {
        const maker = await Maker.create("http", {
            privateKey: PRIVATE_KEY,
            url: URL
        });

        const cdp = await maker.openCdp();
        // const DAI = maker.service("token").getToken("DAI");

        // const cdp = await maker.getCdp(7596);

        console.log("  Paying back DAI");
        await cdp.wipeDai(DAI(DaiToPay));

        console.log("  Remove ETH collateral");

        console.log("  Shutting CDP");
        await cdp.shut();

        console.log("  done!");
    } catch (err) {
        console.log("  Something went wrong");
        console.log(err);
    }
}

async function main() {
    await invest(PRIVATE_KEY, 0.02, 0.1);
    await payback(PRIVATE_KEY, 0.1);
}

// main();

async function smartMain() {
    const web3 = await new Web3("http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    const Peach = accounts[0];
    const Cherry = accounts[1];

    const contract = JSON.parse(
        fs.readFileSync(
            "../../truffle2/build/contracts/HelloWorld.json",
            "utf8"
        )
    );
    const helloABI = contract.abi;
    const hello = new web3.eth.Contract(
        helloABI,
        "0x5d1a90F8967871a501eed11581B626fbc97D1bBf",
        { from: Peach }
    );

    hello.methods.setName("Babi").send();
    console.log(await hello.methods.getName().call());
}

// smartMain();

module.exports = {
    invest,
    payback
};
