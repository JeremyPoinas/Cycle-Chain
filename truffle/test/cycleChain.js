const CycleChain = artifacts.require("CycleChain");


const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('CycleChain', accounts => {
  const [owner, equipmentManufacturer, partManufacturer, client] = accounts;

  let ContractInstance;

  // ::::::::::::: VOTER REGISTRATION ::::::::::::: //


  describe("CYCLECHAIN", function () {

    beforeEach(async function () {
      // Create a new contract instance
      ContractInstance = await CycleChain.new({from:owner});
    });


    describe("SETTING/GETTING ASSEMBLIES", function () {

      beforeEach(async function(){
        await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from: owner});
        await ContractInstance.createPart(partManufacturer, "NFT URI 1", {from: equipmentManufacturer});
        await ContractInstance.createEquipment("serialNumber123", "Bulldozer", client, "model B");
        await ContractInstance.addPartToAssembly("serialNumber123", new BN(1), {from: partManufacturer});
      });

      it("Sets an assembly and gets one assembly", async() => {
        const assembly = await ContractInstance.getOneAssembly("serialNumber123");
        // This getter returns an assembly object which is transformed into a tuple, thus [0] and [1]
        expect(assembly[0]).to.equal("serialNumber123");
        expect(assembly[1].length).to.equal(1);
        expect(assembly[1][0]).to.be.bignumber.equal(new BN(1));
  
      });

      it("Sets another assembly and gets all assemblies", async() => {
        await ContractInstance.createPart(partManufacturer, "NFT URI 2", {from: equipmentManufacturer});
        await ContractInstance.createEquipment("serialNumber456", "Grue", client, "model C");
        await ContractInstance.addPartToAssembly("serialNumber456", new BN(2), {from: partManufacturer});
        const assemblies = await ContractInstance.getAllAssemblies();
        // The second part created is the 8th one (the contract constructor creates 6 parts)
        expect(assemblies[7][0]).to.equal("serialNumber456");
        // TODO: test all other values

      });

    });


    describe("REMOVES EQUIPMENT MANUFACTURER", function () {

      it("Removes an equipment manufacturer", async() => {
        // Register a manufacturer
        await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from: owner});
        expect(await ContractInstance.equipmentManufacturers.call(equipmentManufacturer)).to.be.true;
        // Remove a manufacturer
        await ContractInstance.removeEquipmentManufacturer(equipmentManufacturer, {from: owner});
        expect(await ContractInstance.equipmentManufacturers.call(equipmentManufacturer)).to.be.false;
      });
    });


    describe("LISTING", function () {

      beforeEach(async function(){
        await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from: owner});
        await ContractInstance.createPart(partManufacturer, "NFT URI 1", {from: equipmentManufacturer});
        await ContractInstance.listPart(new BN(1), new BN(100), {from: partManufacturer});
      });

      it("Lists a part", async() => {
        const part = await ContractInstance.parts.call(1)
        expect(part.isListed).to.be.true;
        expect(part.listedPrice).to.be.bignumber.equal(new BN(100));
      });

      it("Updates listing price", async() => {
        await ContractInstance.updateListingPrice(new BN(1), new BN(200), {from: partManufacturer});
        const part = await ContractInstance.parts.call(1);
        expect(part.listedPrice).to.be.bignumber.equal(new BN(200));
      });

      it("Delists a part", async() => {
        await ContractInstance.delistPart(new BN(1), {from: partManufacturer});
        const part = await ContractInstance.parts.call(1);
        expect(part.isListed).to.be.false;
      });

    });

  });
});
