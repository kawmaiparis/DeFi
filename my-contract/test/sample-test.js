const { expect } = require("chai");
const maker = require("@studydefi/money-legos/maker");
const { Wallet } = require("ethers");

describe("Greeter", function () {
    it("Should return the new greeting once it's changed", async function () {
        const Greeter = await ethers.getContractFactory("Greeter");
        const greeter = await Greeter.deploy("Hello, world!");

        await greeter.deployed();
        expect(await greeter.greet()).to.equal("Hello, world!");

        await greeter.setGreeting("Hola, mundo!");
        expect(await greeter.greet()).to.equal("Hola, mundo!");
    });

    // ../tests/maker.test.ts#L22-L37

    it("create a proxy on Maker", async () => {
        // const signers = await ethers.getSigners();
        // const wallet = signers[0];

        // FOR LOCALHOST, DOESNT WORK CUZ CONTRACTS NOT DEPLOYED LOCALLY
        const provider = new ethers.providers.JsonRpcProvider();

        // let infuraProvider = new ethers.providers.InfuraProvider(
        //     "mainnet",
        //     "7d0d81d0919f4f05b9ab6634be01ee73"
        // );

        const privateKey =
            "0x3ff355e2f5de0366747d2818919f36f061514ff079315c3f39717ef82ec7b219";
        const wallet = new ethers.Wallet(privateKey, provider);

        const proxyRegistry = new ethers.Contract(
            maker.proxyRegistry.address,
            maker.proxyRegistry.abi,
            wallet
        );

        // Build proxy if we don't have one
        let before = await proxyRegistry.proxies(wallet.address);

        await proxyRegistry.build({ gasLimit: 1500000 });

        const after = await proxyRegistry.proxies(wallet.address);

        expect(before).to.equal("0x0000000000000000000000000000000000000000");
        expect(after).not.to.equal(
            "0x0000000000000000000000000000000000000000"
        );
    });
});
