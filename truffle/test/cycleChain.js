const SimpleStorage = artifacts.require("CycleChain");

contract('CycleChain', () => {
  it('should read newly written values', async() => {
    const CycleChainInstance = await CycleChain.deployed();
  });
});
