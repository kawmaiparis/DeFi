const hello = artifacts.require("./Agreement");

module.exports = function(deployer) {
    deployer.deploy(hello);
};
