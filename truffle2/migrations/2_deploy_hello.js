const hello = artifacts.require("./HelloWorld");

const helloSettings = {
  name: "Flip"
};

module.exports = function(deployer) {
  deployer.deploy(hello, helloSettings.name);
};
