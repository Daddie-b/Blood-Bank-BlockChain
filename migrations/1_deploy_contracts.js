// migrations/1_deploy_contracts.js
const BloodBank = artifacts.require("BloodBank");

module.exports = function (deployer) {
  deployer.deploy(BloodBank);
};
