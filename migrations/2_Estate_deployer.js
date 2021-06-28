const EstateToken = artifacts.require("EstateToken");

module.exports = deployer => {
    deployer.deploy(EstateToken);
}