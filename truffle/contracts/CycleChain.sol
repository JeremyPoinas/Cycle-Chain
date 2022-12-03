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

  // Equipment's ID => NFT's ID => is installed
  mapping (uint => mapping (uint => bool)) componentsInstalled;

  // Equipment's Owner => Equipment's ID => Equipment
  mapping (address => mapping (uint => Equipment)) equipments;

  struct Component {
    uint equipmentId;
    bool isValue;
  }

  // NFT's ID => Component
  mapping (uint => Component) components;

  // Address => is registered as a producer
  mapping (address => bool) producers;

  // List of events
  event ComponentCreated(uint componentId);
  event NFTCreatorRegistered(address creator);
  event NFTCreatorRemoved(address creator);
  event NftInstalledOnEquipment(uint _NFTid, uint _equipmentId);
  event NftRemovedFromEquipment(uint _NFTid, uint _equipmentId);
  event EquipmentCreated(uint _equipmentId);
  event EquipmentDeleted(uint _equipmentId);

  constructor() ERC721("Component", "CC") {}

  /// @notice Check if the msg.sender is an equipment producer
  modifier onlyProducers() {
      require(producers[msg.sender] == true, "You are not a producer.");
      _;
  }

  /// @notice Create one component (NFT)
  /// @param _producer Address of the entity creating the NFT
  /// @return uint NFT's ID
  function createComponent(address _producer, string memory _tokenURI)
    public
    returns (uint256)
  {
    require(producers[_producer] == true, "You are not registered as a NFT Creator.");

    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(_producer, newItemId);
    _setTokenURI(newItemId, _tokenURI);

    emit ComponentCreated(newItemId);

    return newItemId;
  }

  /// @notice Register a new NFT creator
  /// @param _producer Address of the entity that will be allowed to create a NFT
  function registerNFTCreator(address _producer) external onlyOwner {
    require(producers[_producer] == false, "This address is already registered as a NFT Creator.");

    producers[_producer] = true;
    emit NFTCreatorRegistered(_producer);
  }

  /// @notice Remove a NFT creator
  /// @param _producer Address of the entity that will be fordidden to create a NFT
  function removeNFTCreator(address _producer) external onlyOwner {
    require(producers[_producer] == true, "This address is not registered as a NFT Creator.");

    producers[_producer] = false;
    emit NFTCreatorRemoved(_producer);
  }

  /// @notice Install a NFT on an equipment
  /// @param _NFTid NFT's ID
  /// @param _equipmentId NFT's ID
  function installNftOnEquipment(uint _NFTid, uint _equipmentId) external {
    require(ownerOf(_NFTid) == msg.sender, "You do not possess this component.");
    require(equipments[msg.sender][_equipmentId].isValue == true, "You do not possess this equipment.");
    require(components[_NFTid].equipmentId == 0, "This component is already installed on an equipment.");

    componentsInstalled[_equipmentId][_NFTid] == true;
    components[_NFTid].equipmentId = _equipmentId;

    emit NftInstalledOnEquipment(_NFTid, _equipmentId);
  }

  /// @notice Remove a NFT from an equipment
  /// @param _NFTid NFT's ID
  /// @param _equipmentId NFT's ID
  function removeNftFromEquipment(uint _NFTid, uint _equipmentId) external {
    require(ownerOf(_NFTid) == msg.sender, "You do not possess this component.");
    require(equipments[msg.sender][_equipmentId].isValue == true, "You do not possess this equipment.");
    require(components[_NFTid].equipmentId != 0, "This component is not installed on an equipment.");

    componentsInstalled[_equipmentId][_NFTid] == false;
    components[_NFTid].equipmentId = 0;

    emit NftRemovedFromEquipment(_NFTid, _equipmentId);
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
