// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract CycleChain is ERC721URIStorage, Ownable  {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  enum EquipmentCategory {GRUE, TRACTEUR}
  EquipmentCategory equipmentCategory;

  struct Equipment {
    address producer;
    EquipmentCategory equipmentCategory;
    string model;
    bool isValue;
  }

  // Equipment's ID => Part's ID => is installed
  mapping (uint => mapping (uint => bool)) partsInstalled;

  // Equipment's Owner => Equipment's ID => Equipment
  mapping (address => mapping (uint => Equipment)) equipments;

  struct Part {
    uint equipmentId;
    bool isValue;
    bool isListed;
    uint listedPrice;
  }

  // NFT's ID => Part
  mapping (uint => Part) parts;

  // Address => is registered as a producer
  mapping (address => bool) public producers;

  // List of events
  event PartCreated(uint partId);
  event PartCreatorRegistered(address creator);
  event PartCreatorRemoved(address creator);
  event PartInstalledOnEquipment(uint partId, uint equipmentId);
  event PartRemovedFromEquipment(uint partId, uint equipmentId);
  event EquipmentCreated(uint equipmentId);
  event EquipmentDeleted(uint equipmentId);
  event partListed(uint partId, uint price);
  event partDelisted(uint partId);

  constructor() ERC721("Part", "CC") {}

  /// @notice Check if the msg.sender is an equipment producer
  modifier onlyProducers() {
      require(producers[msg.sender] == true, "You are not a producer.");
      _;
  }

  // ::::::::::::: GETTERS ::::::::::::: //

  function getListingPrice(uint _partId) public view returns (uint256) {
    require(parts[_partId].isValue == true, "This part does not exist");

    return parts[_partId].listedPrice;
  }

  // ::::::::::::: FUNCTIONS ::::::::::::: //

  /// @notice Create one Part (NFT) for a producer
  /// @param _producer Address of the entity creating the NFT
  /// @return uint NFT's ID
  function createPart(address _producer, string memory _tokenURI)
    public
    onlyProducers
    returns (uint256)
  {
    require(_producer != address(0), "ERC721 cannot be minted to the zero address");
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(_producer, newItemId);
    _setTokenURI(newItemId, _tokenURI);

    parts[newItemId].isValue = true;

    emit PartCreated(newItemId);

    return newItemId;
  }

  /// @notice Register a new Part creator
  /// @param _producer Address of the entity that will be allowed to create a Part NFT
  function registerPartCreator(address _producer) external onlyOwner {
    require(producers[_producer] == false, "This address is already registered as a Part Creator.");

    producers[_producer] = true;
    emit PartCreatorRegistered(_producer);
  }

  /// @notice Remove a Part creator
  /// @param _producer Address of the entity that will be fordidden to create a Part NFT
  function removePartCreator(address _producer) external onlyOwner {
    require(producers[_producer] == true, "This address is not registered as a Part Creator.");

    producers[_producer] = false;
    emit PartCreatorRemoved(_producer);
  }

  /// @notice Install a NFT on an equipment
  /// @param _PartId Part's ID
  /// @param _equipmentId Equipment's ID
  function installPartOnEquipment(uint _PartId, uint _equipmentId) external {
    require(ownerOf(_PartId) == msg.sender, "You do not possess this part.");
    require(equipments[msg.sender][_equipmentId].isValue == true, "You do not possess this equipment.");
    require(parts[_PartId].equipmentId == 0, "This part is already installed on an equipment.");

    partsInstalled[_equipmentId][_PartId] == true;
    parts[_PartId].equipmentId = _equipmentId;

    emit PartInstalledOnEquipment(_PartId, _equipmentId);
  }

  /// @notice Remove a NFT from an equipment
  /// @param _PartId NFT's ID
  /// @param _equipmentId NFT's ID
  function removePartFromEquipment(uint _PartId, uint _equipmentId) external {
    require(ownerOf(_PartId) == msg.sender, "You do not possess this part.");
    require(equipments[msg.sender][_equipmentId].isValue == true, "You do not possess this equipment.");
    require(parts[_PartId].equipmentId != 0, "This part is not installed on an equipment.");

    partsInstalled[_equipmentId][_PartId] == false;
    parts[_PartId].equipmentId = 0;

    emit PartRemovedFromEquipment(_PartId, _equipmentId);
  }

  /// @notice Create an equipment
  /// @param _equipmentId Equipment's ID
  function createEquipment(uint _equipmentId, EquipmentCategory _equipmentCategory, string memory _equipmentModel, address _owner) external onlyProducers {
    require(equipments[msg.sender][_equipmentId].isValue == false, "You already have this equipment.");

    Equipment memory equipment;
    equipment.equipmentCategory = _equipmentCategory;
    equipment.producer = msg.sender;
    equipment.model = _equipmentModel;
    equipment.isValue = true;

    equipments[_owner][_equipmentId] = equipment;
    emit EquipmentCreated(_equipmentId);
  }

  /// @notice Delete an equipment
  /// @param _equipmentId Equipment's ID
  function deleteEquipment(uint _equipmentId) external onlyProducers {
    require(equipments[msg.sender][_equipmentId].isValue == true, "You don't have this equipment.");

    Equipment memory equipment;
    equipments[msg.sender][_equipmentId] = equipment;
    emit EquipmentDeleted(_equipmentId);
  }

  /// @notice List a part
  /// @param _partId Part's ID
  /// @param _price Part's price
  function listPart(uint _partId, uint _price) external {
    require(msg.sender == this.ownerOf(_partId), "You don't possess this part.");
    require(parts[_partId].isListed == false, "This part is already listed.");

    parts[_partId].isListed = true;
    parts[_partId].listedPrice = _price;
    emit partListed(_partId, _price);
  }

  /// @notice Delist a part
  /// @param _partId Part's ID
  function delistPart(uint _partId) external {
    require(msg.sender == this.ownerOf(_partId), "You don't possess this part.");
    require(parts[_partId].isListed == true, "This part is not listed.");

    parts[_partId].isListed = false;
    parts[_partId].listedPrice = 0;
    emit partDelisted(_partId);
  }

  /// @notice Update the listing price
  /// @param _partId Part's ID
  /// @param _price Part's price
  function updateListingPrice(uint _partId, uint _price) public {
    require(msg.sender == this.ownerOf(_partId), "You don't possess this part.");
    require(parts[_partId].isListed == true, "This part is not listed.");

    parts[_partId].listedPrice = _price;
    emit partListed(_partId, _price);
  }

  /// @notice Buy a part at market price
  /// @param _partId Part's ID
  function marketBuyPart(uint256 _partId) public payable {
    uint listedPrice = parts[_partId].listedPrice;
    require(parts[_partId].isListed == true, "This part is not listed.");
    require(msg.value == listedPrice, "Message value is not equal to listed price");

    address payable owner = payable(this.ownerOf(_partId));
    this.safeTransferFrom(owner, msg.sender, _partId);
    payable(owner).transfer(listedPrice);
    parts[_partId].isListed = false;
    parts[_partId].listedPrice = 0;
  }
}
