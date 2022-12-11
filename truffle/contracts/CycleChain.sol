// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract CycleChain is ERC721URIStorage, Ownable  {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    // Part object
    struct Part {
        bool isListed;
        uint listedPrice;
    }

    // Part array with index that will be equal to the NFT' ID
    Part[] public parts;

    // Equipment object
    struct Equipment {
        string serialNumber;
        string category;
        address manufacturer;
        address owner;
        string model;
        // string photoURL; To add in V2
        bool isValue;
    }

    // Equipment serialNumber => Equipment
    mapping (string => Equipment) equipments;

    // A table of all equipments serial numbers to make the mapping enumerable
    string[] equipmentsSerialNumbers;


    // An equipment can contain parts, forming an "assembly"
    struct Assembly {
        string equipmentSerialNumber;
        uint[] partsIds;
    }

    // Equipment serialNumber => Assembly
    mapping (string => Assembly) assemblies;

    // Equipment manufacturers mapping
    mapping (address => bool) public equipmentManufacturers;

    // List of events
    event PartCreated(uint NftId);
    event EquipmentManufacturerRegistered(address _address);
    event EquipmentManufacturerRemoved(address _address);
    event PartInstalledOnEquipment(uint _partId, string _equipmentSerialNumber);
    event PartRemovedFromEquipment(uint partId, uint equipmentId);
    event EquipmentCreated(string equipmentId);
    event partListed(uint partId, uint price);
    event partDelisted(uint partId);

    constructor() ERC721("Part", "CC") {
      // In order to have the index of parts equal to the NFT ID, we need to fill the index 0 of parts
      Part memory part;
      parts.push(part);

      // Create mock equipments
      createEquipment('TD1', 'Grue',        0x0Aa9547EE37E6B9064f9FB95cd2E8864DC6D3569, 'MODEL_123');
      createEquipment('TD2', 'Grue',        0x0Aa9547EE37E6B9064f9FB95cd2E8864DC6D3569, 'MODEL_123');
      createEquipment('TD3', 'Pelleteuse',  0x0Aa9547EE37E6B9064f9FB95cd2E8864DC6D3569, 'MODEL_123');
      createEquipment('JP1', 'Grue',        0x1e3CdC405728560eebC4ab093D9c461b36E28Aa3, 'MODEL_123');
      createEquipment('JP2', 'Pelleteuse',  0x1e3CdC405728560eebC4ab093D9c461b36E28Aa3, 'MODEL_123');
      createEquipment('JP3', 'Pelleteuse',  0x1e3CdC405728560eebC4ab093D9c461b36E28Aa3, 'MODEL_123');
    }

    /// @notice Check if the msg.sender is an equipment manufacturer
    modifier onlyEquipmentManufacturers() {
        require(equipmentManufacturers[msg.sender] == true, "You are not an equipment manufacturer.");
        _;
    }
    
    // ::::::::::::: GETTERS ::::::::::::: //

    function getOneEquipment(string memory _serialNumber) public view returns (Equipment memory) {
        Equipment memory equipment;

        equipment = equipments[_serialNumber];
        return equipment;
    }

    function getOneAssembly(string memory _serialNumber) public view returns (Assembly memory) {
        Assembly memory oneAssembly;

        oneAssembly = assemblies[_serialNumber];
        return oneAssembly;
    }

    function getAllEquipments() public view returns (Equipment[] memory) {
        uint len = equipmentsSerialNumbers.length;
        Equipment[] memory equipmentsArray = new Equipment[](len);

        for (uint i=0; i<len; i++) {
            equipmentsArray[i] = equipments[equipmentsSerialNumbers[i]];
        }
        return equipmentsArray;
    }

    function getAllAssemblies() public view returns (Assembly[] memory) {
        uint len = equipmentsSerialNumbers.length;
        Assembly[] memory assembliesArray = new Assembly[](len);

        for (uint i=0; i<len; i++) {
            assembliesArray[i] = assemblies[equipmentsSerialNumbers[i]];
        }
        return assembliesArray;
    }


    // ::::::::::::: FUNCTIONS ::::::::::::: //


    /// @notice Register a new Equipment Manufacturer
    /// @param _producer Address of the Equipment Manufacturer that will be allowed to create a Part (NFT)
    function registerEquipmentManufacturer(address _producer) external onlyOwner {
      require(equipmentManufacturers[_producer] == false, "This address is already registered as an Equipment Manufacturer.");

      equipmentManufacturers[_producer] = true;
      emit EquipmentManufacturerRegistered(_producer);
    }

    /// @notice Remove an Equipment Manufacturer
    /// @param _producer Address of the Equipment Manufacturer that will be allowed to create a Part (NFT)
    function removeEquipmentManufacturer(address _producer) external onlyOwner {
      require(equipmentManufacturers[_producer] == true, "This address is not registered as an Equipment Manufacturer.");

      equipmentManufacturers[_producer] = false;
      emit EquipmentManufacturerRemoved(_producer);
    }

    /// TODO PUT BACK MODIFIER onlyEquipmentManufacturers
    /// @notice Adds an equipment to the equipments mapping and update the equipmentsSerialNumbers array
    /// @param _serialNumber Serial Number
    /// @param _category Category
    /// @param _owner The owner of the equipment (company name)
    /// @param _model Equipment model
    function createEquipment(string memory _serialNumber, string memory _category, address _owner, string memory _model) public {
      require(equipments[_serialNumber].isValue == false, "This equipment already exists.");
      Equipment memory eq;
      eq.serialNumber = _serialNumber;
      eq.category = _category;
      eq.manufacturer = msg.sender;
      eq.owner = _owner;
      eq.model = _model;
      eq.isValue = true;

      equipments[_serialNumber] = eq;
      equipmentsSerialNumbers.push(_serialNumber);

      emit EquipmentCreated(_serialNumber);
    }

    function checkIfPartExistsInAssembly(string memory _equipmentSerialNumber, uint _partId) internal view returns(bool) {
      for (uint i = 0; i <assemblies[_equipmentSerialNumber].partsIds.length; i++) {
        if (assemblies[_equipmentSerialNumber].partsIds[i] == _partId) return true;
      }
      return false;
    }

    /// @notice Adds a part to an assembly (or creates he assembly if it doesn't exist)
    /// @param _equipmentSerialNumber The serial number of the equipment
    /// @param _partId The id of the part to be installed
    function addPartToAssembly(string memory _equipmentSerialNumber, uint _partId) external {
      require(ownerOf(_partId) == msg.sender, "You do not possess this part");
      require(equipments[_equipmentSerialNumber].isValue == true, "You do not have this equipment");
      require(parts.length - 1 >= _partId, "You do not have this part");
      require(checkIfPartExistsInAssembly(_equipmentSerialNumber, _partId) == false, "Part already installed in assembly");

      assemblies[_equipmentSerialNumber].equipmentSerialNumber = _equipmentSerialNumber;
      assemblies[_equipmentSerialNumber].partsIds.push(_partId);
      emit PartInstalledOnEquipment(_partId, _equipmentSerialNumber);
    }

    /// @notice As an equipment manufacturer, create a part NFT and transfer it to a part manufacturer
    /// @param _forManufacturer Address of the part producer that will get the Part (NFT)
    /// @return uint NFT's ID
    function createPart(address _forManufacturer, string  memory _partURI) public onlyEquipmentManufacturers returns (uint256) {
        require(_forManufacturer != address(0), "ERC721 cannot be minted to the zero address");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_forManufacturer, newItemId);
        _setTokenURI(newItemId, _partURI);

        Part memory part;
        parts.push(part);

        emit PartCreated(newItemId);

        return newItemId;
    }

    /// @notice List a part
    /// @param _nftId Part's NFT ID
    /// @param _price Part's price
    function listPart(uint _nftId, uint _price) external {
      require(msg.sender == this.ownerOf(_nftId), "You don't possess this part.");
      require(parts[_nftId].isListed == false, "This part is already listed.");

      parts[_nftId].isListed = true;
      parts[_nftId].listedPrice = _price;
      emit partListed(_nftId, _price);
    }

    /// @notice Delist a part
    /// @param _nftId Part's NFT ID
    function delistPart(uint _nftId) external {
      require(msg.sender == this.ownerOf(_nftId), "You don't possess this part.");
      require(parts[_nftId].isListed == true, "This part is not listed.");

      parts[_nftId].isListed = false;
      parts[_nftId].listedPrice = 0;
      emit partDelisted(_nftId);
    }

    /// @notice Update the listing price
    /// @param _nftId Part's NFT ID
    /// @param _price Part's price
    function updateListingPrice(uint _nftId, uint _price) external {
      require(msg.sender == this.ownerOf(_nftId), "You don't possess this part.");
      require(parts[_nftId].isListed == true, "This part is not listed.");

      parts[_nftId].listedPrice = _price;
      emit partListed(_nftId, _price);
    }


    /// @notice Buy a part at market price
    /// @param _nftId Part's NFT ID
    function marketBuyPart(uint256 _nftId) public payable {
      uint listedPrice = parts[_nftId].listedPrice;
      require(parts[_nftId].isListed == true, "This part is not listed.");
      require(msg.value == listedPrice, "Message value is not equal to listed price");

      address payable owner = payable(this.ownerOf(_nftId));
      this.safeTransferFrom(owner, msg.sender, _nftId);
      payable(owner).transfer(listedPrice);
      parts[_nftId].isListed = false;
      parts[_nftId].listedPrice = 0;
    }

    /*
    // This function removes a part from an assembly
    function removePartFromAssembly(string memory _equipmentSerialNumber, string memory _partSerialNumber) public {
      // TODO: Check if msg.sender is the owner of the part
      // TODO: Check if equipment exists
      // TODO: Check if part exists
      uint len = assemblies[_equipmentSerialNumber].partsSerialNumbers.length;
      string[] memory existingPartsArray = new string[](len);
      existingPartsArray = assemblies[_equipmentSerialNumber].partsSerialNumbers;

      bool found = false;
      for(uint i=0; i<len; i++){
        // Compare part with part to be deleted
        if(keccak256(abi.encodePacked(partsArray[i])) == keccak256(abi.encodePacked(_partSerialNumber))) {
          found = true;
          // Replace the part to be deleted with the last part of the array
          partsArray[i] = partsArray[len-1];
        }
      }

      if (found) {
        partsArray.pop();
      }

      partsArray[len] = _partSerialNumber;
      setAssembly(_equipmentSerialNumber, partsArray);

      //emit PartRemovedFromEquipment(_partSerialNumber, _equipmentSerialNumber);
    }
    */
}