// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract CycleChain is ERC721URIStorage, Ownable  {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  enum EquipmentType {GRUE, TRACTEUR}
  EquipmentType equipmentType;

  struct Equipment {
    address producer;
    EquipmentType equipmentType;
    bool isValue;
  }

  // Equipment's ID => Part's ID => is installed
  mapping (uint => mapping (uint => bool)) partsInstalled;

  // Equipment's Owner => Equipment's ID => Equipment
  mapping (address => mapping (uint => Equipment)) equipments;

  struct Part {
    uint equipmentId;
    bool isValue;
  }

  // NFT's ID => Part
  mapping (uint => Part) parts;

  // Address => is registered as a producer
  mapping (address => bool) producers;

  // List of events
  event PartCreated(uint partId);
  event PartCreatorRegistered(address creator);
  event PartCreatorRemoved(address creator);
  event PartInstalledOnEquipment(uint _PartId, uint _equipmentId);
  event PartRemovedFromEquipment(uint _PartId, uint _equipmentId);
  event EquipmentCreated(uint _equipmentId);
  event EquipmentDeleted(uint _equipmentId);

  constructor() ERC721("Part", "CC") {}

  /// @notice Check if the msg.sender is an equipment producer
  modifier onlyProducers() {
      require(producers[msg.sender] == true, "You are not a producer.");
      _;
  }

  /// @notice Create one Part (NFT) for a producer
  /// @param _producer Address of the entity creating the NFT
  /// @return uint NFT's ID
  function createPart(address _producer, string memory _tokenURI)
    public
    onlyProducers
    returns (uint256)
  {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(_producer, newItemId);
    _setTokenURI(newItemId, _tokenURI);

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
  function removeNFTCreator(address _producer) external onlyOwner {
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
  function removeNftFromEquipment(uint _PartId, uint _equipmentId) external {
    require(ownerOf(_PartId) == msg.sender, "You do not possess this part.");
    require(equipments[msg.sender][_equipmentId].isValue == true, "You do not possess this equipment.");
    require(parts[_PartId].equipmentId != 0, "This part is not installed on an equipment.");

    partsInstalled[_equipmentId][_PartId] == false;
    parts[_PartId].equipmentId = 0;

    emit PartRemovedFromEquipment(_PartId, _equipmentId);
  }

  /// @notice Create an equipment
  /// @param _equipmentId Equipment's ID
  function createEquipment(uint _equipmentId, EquipmentType _equipmentType) external onlyProducers {
    require(equipments[msg.sender][_equipmentId].isValue == false, "You already have this equipment.");

    Equipment memory equipment;
    equipment.equipmentType = _equipmentType;
    equipment.isValue = true;

    equipments[msg.sender][_equipmentId] = equipment;
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
}
