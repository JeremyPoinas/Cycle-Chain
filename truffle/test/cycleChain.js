const CycleChain = artifacts.require("CycleChain");


const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('CycleChain', accounts => {
  const [owner, second, third] = accounts;

  let ContractInstance;

  // ::::::::::::: VOTER REGISTRATION ::::::::::::: //


  describe("Voter registration", function () {

    let voter;

    beforeEach(async function () {
      // Create a new contract instance
      ContractInstance = await CycleChain.new({from:owner});
    });


    it("Sets an assembly", async() => {
      //const assembly = ContractInstance.
      await ContractInstance.addPartToAssembly("123",3);

    });





  });
});
