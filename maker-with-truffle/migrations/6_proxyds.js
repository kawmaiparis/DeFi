const ProxyDs = artifacts.require("./DssProxyActions.sol");

module.exports = function(deployer) {
    deployer.deploy(ProxyDs);
};
