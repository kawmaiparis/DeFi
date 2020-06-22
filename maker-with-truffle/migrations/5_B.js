const B = artifacts.require("./B.sol");

module.exports = function(deployer) {
    deployer.deploy(B);
};
