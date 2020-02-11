const Maker = require("@makerdao/dai");

const { MKR, DAI, ETH, WETH, PETH, USD_ETH, USD_MKR, USD_DAI } = Maker;

/* account 1 */
const PRIVATE_KEY =
  "0x05D6E90A4668FDCDFA03DCB6AC5F3F5B5E4D06070CD92A488DE464E39587566B";

/* account 3 */
// const PRIVATE_KEY =
//   "0x862551255A92AF0B31222952088F75993F3F1E9E8AB4BA0BF88359DFE8159B4D";

const URL = "https://kovan.infura.io/v3/b839d484af444e308e098f46555e0260";

async function invest(EthToDeposit, DaiToDraw) {
  try {
    const maker = await Maker.create("http", {
      privateKey: PRIVATE_KEY,
      url: URL
    });

    // const dai = maker.service("token").getToken("DAI");

    // this sometimes fail for unknown reason...
    // await maker.authenticate();

    console.log("opening CDP");
    const cdp = await maker.openCdp();
    console.log(cdp);

    console.log("locking Eth");
    await cdp.lockEth(EthToDeposit);

    // const balance = await dai.balanceOf(defaultAccount);

    // console.log("Dai balance before drawing:", balance.toString());

    console.log("drawing DAI");
    const txn = await cdp.drawDai(DaiToDraw);
    // console.log("Amount Drawn:", txn);

    // balance = await dai.balanceOf(defaultAccount);
    // console.log("Dai balance after drawing:", balance.toString());

    const debt = await cdp.getDebtValue();
    console.log(debt); // '1.00 DAI'

    console.log("Invest done!");
    return cdp;
  } catch (err) {
    console.log("Something went wrong");
    console.log(err);
  }
}

async function payback(DaiToPay, cdp) {
  try {
    const maker = await Maker.create("http", {
      privateKey: PRIVATE_KEY,
      url: URL
    });

    // const DAI = maker.service("token").getToken("DAI");

    // const cdp = await maker.getCdp(7596);

    console.log("Paying back DAI");
    await cdp.wipeDai(DAI(DaiToPay));

    console.log("Remove ETH collateral");

    console.log("Shutting CDP");
    await cdp.shut();

    console.log("done!");
  } catch (err) {
    console.log("Something went wrong");
    console.log(err);
  }
}

async function main() {
  const cdp = await invest(0.02, 0.1);
  await payback(0.1, cdp);
}

console.log(DAI);
// main();
