const CycleChain = artifacts.require("CycleChain");

module.exports = async function (callback) {
  const deployed = await CycleChain.deployed();
  callback();
};
