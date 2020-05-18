const { expect } = require("chai");

describe("Token contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
        const [owner] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");

        const buidlerToken = await Token.deploy();
        await buidlerToken.deployed();

        const ownerBalance = await buidlerToken.balanceOf(owner.getAddress());
        expect(await buidlerToken.totalSupply()).to.equal(ownerBalance);
    });
});

describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");

        const buidlerToken = await Token.deploy();
        await buidlerToken.deployed();

        // Transfer 50 tokens from owner to addr1
        await buidlerToken.transfer(await addr1.getAddress(), 50);
        expect(await buidlerToken.balanceOf(await addr1.getAddress())).to.equal(
            50
        );

        // Transfer 50 tokens from addr1 to addr2
        await buidlerToken
            .connect(addr1)
            .transfer(await addr2.getAddress(), 50);
        expect(await buidlerToken.balanceOf(await addr2.getAddress())).to.equal(
            50
        );
    });
});
