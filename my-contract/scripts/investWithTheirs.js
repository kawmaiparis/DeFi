const bre = require("@nomiclabs/buidler");
const maker = require("@studydefi/money-legos/maker");
const dappsys = require("@studydefi/money-legos/dappsys");
const erc20 = require("@studydefi/money-legos/erc20");

const wallet = "0xc783df8a850f42e7f7e57013759c285caa701eb6";

async function main() {
    const provider = new ethers.providers.JsonRpcProvider();
    const privateKey =
        "0xc64b9aca3c8975fd4708ff41796f0dcd875722e129e3965cc799dd54d55bced8";

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

    // Build Contract instance
    const proxyContract = new ethers.Contract(
        proxyAddress,
        dappsys.dsProxy.abi,
        wallet
    );

    // Prepare data for delegate call
    const IDssProxyActions = new ethers.utils.Interface(
        maker.dssProxyActions.abi
    );

    const _data = IDssProxyActions.functions.openLockETHAndDraw.encode([
        maker.dssCdpManager.address,
        maker.jug.address,
        maker.ethAJoin.address,
        maker.daiJoin.address,
        ethers.utils.formatBytes32String(maker.ethA.symbol),
        ethers.utils.parseUnits("20", erc20.dai.decimals),
    ]);

    const ethBefore = await await wallet.getBalance();
    const daiBefore = await daiContract.balanceOf(wallet.address);

    // Open vault through proxy
    await proxyContract.execute(maker.dssProxyActions.address, _data, {
        gasLimit: 2500000,
        value: ethers.utils.parseEther("1"),
    });

    const ethAfter = await await wallet.getBalance();
    const daiAfter = await daiContract.balanceOf(wallet.address);

    const ethSpent = parseFloat(ethBefore.sub(ethAfter));
    const daiGained = parseFloat(daiAfter.sub(daiBefore));

    console.log("ethSpent: " + ethSpent);
    console.log("daiGained: " + daiGained);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
