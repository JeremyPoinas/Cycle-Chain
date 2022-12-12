const CycleChain = artifacts.require("CycleChain");


const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('CycleChain', accounts => {
  const [owner, equipmentManufacturer, partManufacturer, client] = accounts;

  let ContractInstance;



  describe("Register equipment manufacturer", function () {

    beforeEach(async function () {
      // Create a new contract instance
      ContractInstance = await CycleChain.new({from:owner});
    });

    it("should register the address as equipment manufacturer", async () => {
      await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from:owner});
      expect(await ContractInstance.equipmentManufacturers.call(equipmentManufacturer)).to.be.true;
    });

    it("should revert if the caller is not owner", async () => {
      await expectRevert(ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from:client}), "Ownable: caller is not the owner");
    });

    it("should revert if the address is already registered as an Equipment Manufacturer.", async () => {
      await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from:owner});
      await expectRevert(
        ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from:owner}),
        "This address is already registered as an Equipment Manufacturer."
      );
    });

    it("should emit the event EquipmentManufacturerRegistered", async () => {
      const newManufacturer = await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from:owner});
      expectEvent(
        newManufacturer,
        'EquipmentManufacturerRegistered',
        { _address: equipmentManufacturer }
      );
    });
  });

  describe("Create equipment / Get one equipment", function () {

    let equipment;

    beforeEach(async function () {
      // Create a new contract instance
      ContractInstance = await CycleChain.new({from:owner});
      await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from:owner});
    });

    it("should create an equipment", async () => {
      await ContractInstance.createEquipment('serialNumber', 'category', client, 'model', {from:equipmentManufacturer});
      equipment = await ContractInstance.getOneEquipment.call('serialNumber');
      expect(equipment).to.exist;
    });

    it("equipment's serial number should be stored", async () => {
      await ContractInstance.createEquipment('serialNumber', 'category', client, 'model', {from:equipmentManufacturer});
      equipment = await ContractInstance.getOneEquipment.call('serialNumber');
      expect(equipment.serialNumber).to.be.equal('serialNumber');
      expect(equipment.serialNumber).to.be.a('string');
    });

    it("equipment's category should be stored", async () => {
      await ContractInstance.createEquipment('serialNumber', 'category', client, 'model', {from:equipmentManufacturer});
      equipment = await ContractInstance.getOneEquipment.call('serialNumber');
      expect(equipment.category).to.be.equal('category');
      expect(equipment.category).to.be.a('string');
    });

    it("equipment's owner should be stored", async () => {
      await ContractInstance.createEquipment('serialNumber', 'category', client, 'model', {from:equipmentManufacturer});
      equipment = await ContractInstance.getOneEquipment.call('serialNumber');
      expect(equipment.owner).to.be.equal(client);
      expect(equipment.owner).to.be.a('string');
    });

    it("equipment's manufacturer should be stored ", async () => {
      await ContractInstance.createEquipment('serialNumber', 'category', client, 'model', {from:equipmentManufacturer});
      equipment = await ContractInstance.getOneEquipment.call('serialNumber');
      expect(equipment.manufacturer).to.be.equal(equipmentManufacturer);
      expect(equipment.manufacturer).to.be.a('string');
    });

    it("equipment's model should be stored", async () => {
      await ContractInstance.createEquipment('serialNumber', 'category', client, 'model', {from:equipmentManufacturer});
      equipment = await ContractInstance.getOneEquipment.call('serialNumber');
      expect(equipment.model).to.be.equal('model');
      expect(equipment.model).to.be.a('string');
    });

    it("equipment's isValue should be true", async () => {
      await ContractInstance.createEquipment('serialNumber', 'category', client, 'model', {from:equipmentManufacturer});
      equipment = await ContractInstance.getOneEquipment.call('serialNumber');
      expect(equipment.isValue).to.be.true;
    });

    it("should revert if the caller is not an equipment manufacturer", async () => {
      await expectRevert(ContractInstance.createEquipment('serialNumber', 'category', client, 'model', {from:client}), "You are not an equipment manufacturer.");
    });

    it("should revert if the equipment already exists", async () => {
      await ContractInstance.createEquipment('serialNumber', 'category', client, 'model', {from:equipmentManufacturer});
      await expectRevert(ContractInstance.createEquipment('serialNumber', 'category', client, 'model', {from:equipmentManufacturer}), "This equipment already exists.");
    });
  });

  describe("Get all equipments", function () {

    let equipments;

    beforeEach(async function () {
      // Create a new contract instance
      ContractInstance = await CycleChain.new({from:owner});
      await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from:owner});
      await ContractInstance.createEquipment('1', 'category1', client, 'model1', {from:equipmentManufacturer});
      await ContractInstance.createEquipment('2', 'category2', client, 'model2', {from:equipmentManufacturer});
    });

    it("should get an array of 2 equipments", async () => {
      equipments = await ContractInstance.getAllEquipments();
      expect(equipments).to.have.lengthOf(2);
    });

    it("equipment 1 should be filled", async () => {
      equipments = await ContractInstance.getAllEquipments();
      expect(equipments[0].serialNumber).to.be.equal('1');
      expect(equipments[0].category).to.be.equal('category1');
      expect(equipments[0].model).to.be.equal('model1');
      expect(equipments[0].owner).to.be.equal(client);
      expect(equipments[0].manufacturer).to.be.equal(equipmentManufacturer);
      expect(equipments[0].isValue).to.be.true;
    });

    it("equipment 2 should be filled", async () => {
      equipments = await ContractInstance.getAllEquipments();
      expect(equipments[1].serialNumber).to.be.equal('2');
      expect(equipments[1].category).to.be.equal('category2');
      expect(equipments[1].model).to.be.equal('model2');
      expect(equipments[1].owner).to.be.equal(client);
      expect(equipments[1].manufacturer).to.be.equal(equipmentManufacturer);
      expect(equipments[1].isValue).to.be.true;
    });
  });

  describe("Add part to assembly", function () {

    let assembly;

    beforeEach(async function () {
      // Create a new contract instance
      ContractInstance = await CycleChain.new({from:owner});
      await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from:owner});
      await ContractInstance.createEquipment('serialNumber', 'category', partManufacturer, 'model', {from:equipmentManufacturer});
      await ContractInstance.createPart(partManufacturer, "tokenURI", {from:equipmentManufacturer});
    });

    it("should add the part to the equipment's assembly", async () => {
      await ContractInstance.addPartToAssembly('serialNumber', 1, {from:partManufacturer});
      assembly = await ContractInstance.getOneAssembly.call('serialNumber');
      expect(assembly).to.exist;
    });

    it("equipment's serial number should be stored", async () => {
      await ContractInstance.addPartToAssembly('serialNumber', 1, {from:partManufacturer});
      assembly = await ContractInstance.getOneAssembly.call('serialNumber');
      expect(assembly[0]).to.be.equal('serialNumber');
      expect(assembly[0]).to.be.a('string');
    });

    it("equipment's part should be stored", async () => {
      await ContractInstance.addPartToAssembly('serialNumber', 1, {from:partManufacturer});
      assembly = await ContractInstance.getOneAssembly.call('serialNumber');
      expect(assembly.partsIds[0]).to.be.equal('1');
    });

    it("multiple parts should be stored", async () => {
      await ContractInstance.addPartToAssembly('serialNumber', 1, {from:partManufacturer});
      await ContractInstance.createPart(partManufacturer, "tokenURI", {from:equipmentManufacturer});
      await ContractInstance.addPartToAssembly('serialNumber', 2, {from:partManufacturer});
      assembly = await ContractInstance.getOneAssembly.call('serialNumber');
      expect(assembly.partsIds[0]).to.be.equal('1');
      expect(assembly.partsIds[1]).to.be.equal('2');
    });

    it("should revert if the caller does not own the part", async () => {
      await ContractInstance.createPart(client, "tokenURI", {from:equipmentManufacturer});
      await expectRevert(ContractInstance.addPartToAssembly('serialNumber', 2, {from:partManufacturer}), "You do not possess this part");
    });

    it("should revert if the caller does not own the equipment", async () => {
      await ContractInstance.createEquipment('serialNumber2', 'category', client, 'model', {from:equipmentManufacturer});
      await expectRevert(ContractInstance.addPartToAssembly('serialNumber2', 1, {from:partManufacturer}), "You do not have this equipment");
    });

    it("should revert if the part is already in the equipment", async () => {
      await ContractInstance.addPartToAssembly('serialNumber', 1, {from:partManufacturer});
      await expectRevert(ContractInstance.addPartToAssembly('serialNumber', 1, {from:partManufacturer}), "Part already installed in assembly");
    });

    it("should emit the event PartInstalledOnEquipment", async () => {
      const newAssembly = await ContractInstance.addPartToAssembly('serialNumber', 1, {from:partManufacturer});
      expectEvent(
        newAssembly,
        'PartInstalledOnEquipment',
        { partId: '1',  equipmentSerialNumber: 'serialNumber' }
      );
    });
  });

  describe("Create a Part", function () {

    let part;

    beforeEach(async function () {
      // Create a new contract instance
      ContractInstance = await CycleChain.new({from:owner});
      await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from:owner});
    });

    it("should create a part Listing Info", async () => {
      await ContractInstance.createPart(partManufacturer, "tokenURI", {from:equipmentManufacturer});
      part = await ContractInstance.parts.call(1);
      expect(part).to.exist;
      expect(part.isListed).to.be.false;
      expect(part.listedPrice).to.be.bignumber.equal(new BN(0));
    });

    it("should create the token URI", async () => {
      await ContractInstance.createPart(
        partManufacturer,
        `{
          "serialNumber": "123",
          "category": "category123",
          "model": "model123",
          "producerAddress": "${partManufacturer}",
          "minterAddress": "${equipmentManufacturer}"
        }`,
        {from:equipmentManufacturer}
      );
      part = await ContractInstance.tokenURI.call(1);
      const partObject = JSON.parse(part);
      expect(partObject.serialNumber).to.be.equal("123");
      expect(partObject.category).to.be.equal("category123");
      expect(partObject.model).to.be.equal("model123");
      expect(partObject.producerAddress).to.be.equal(partManufacturer);
      expect(partObject.minterAddress).to.be.equal(equipmentManufacturer);
    });

    it("part's owner should be the one selected", async () => {
      await ContractInstance.createPart(partManufacturer, "tokenURI", {from:equipmentManufacturer});
      partOwner = await ContractInstance.ownerOf(1);
      expect(partOwner).to.be.equal(partManufacturer);
    });

    it("should revert if the part's owner is address 0", async () => {
      await expectRevert(ContractInstance.createPart("0x0000000000000000000000000000000000000000", "tokenURI", {from:equipmentManufacturer}), "ERC721 cannot be minted to the zero address");
    });

    it("should revert if the caller is not an equipment manufacturer", async () => {
      await expectRevert(ContractInstance.createPart(partManufacturer, "tokenURI", {from:client}), "You are not an equipment manufacturer.");
    });
  });

  describe("Market buy a part", function () {

    let part;

    beforeEach(async function () {
      // Create a new contract instance
      ContractInstance = await CycleChain.new({from:owner});
      await ContractInstance.registerEquipmentManufacturer(equipmentManufacturer, {from:owner});
      await ContractInstance.createPart(partManufacturer, "tokenURI", {from:equipmentManufacturer});
      await ContractInstance.approve(ContractInstance.address, 1, {from:partManufacturer});
      await ContractInstance.listPart(1, 100, {from:partManufacturer});
    });

    it("should change ownership", async () => {
      const messageValue = 100 * 10**18;
      await ContractInstance.marketBuyPart(1, {from:client, value:messageValue});
      partOwner = await ContractInstance.ownerOf(1);
      expect(partOwner).to.be.equal(client);
    });

    it("should reset listing info", async () => {
      const messageValue = 100 * 10**18;
      await ContractInstance.marketBuyPart(1, {from:client, value:messageValue});
      part = await ContractInstance.parts.call(1);
      expect(part.isListed).to.be.false;
      expect(part.listedPrice).to.be.bignumber.equal(new BN(0));
    });

    it("should revert if the message value is not equal the listing price", async () => {
      const messageValue = 90 * 10**18;
      await expectRevert(ContractInstance.marketBuyPart(1, {from:client, value:messageValue}), "Message value is not equal to listed price");
    });

    it("should revert if the part is not listed", async () => {
      await ContractInstance.delistPart(1, {from:partManufacturer});
      const messageValue = 90 * 10**18;
      await expectRevert(ContractInstance.marketBuyPart(1, {from:client, value:messageValue}), "This part is not listed.");
    });
  });
});