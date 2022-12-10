// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract CycleChain is ERC721URIStorage, Ownable  {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;


    // Part object
    struct Part {
        string serialNumber;
        string category;
        string model;
        string manufacturer;

        bool isListed;
        uint listedPrice;
        bool isValue;
    }

    // Part NFT id => Part
    mapping (uint => Part) parts;

    // A table of all NFT ids to make the mapping enumerable
    uint[] nftIds;

    // Equipment object
    struct Equipment {
        string serialNumber;
        string category;
        string manufacturer;
        string owner; // Company name
        string model;
        string photoURL;
        bool isValue;
    }

    // Equipment serialNumber => Equipment
    mapping (string => Equipment) equipments;

    // A table of all equipments serial numbers to make the mapping enumerable
    string[] equipmentsSerialNumbers;


    // An equipment can contain parts, forming an "assembly"
    struct Assembly {
        string equipmentSerialNumber;
        string[] partsSerialNumbers;
    }

    // Equipment serialNumber => Assembly
    mapping (string => Assembly) assemblies;


    // Operation object
    struct Operation {
        string category;
        string partSerialNumber;
        string equipmentSerialNumber;
        string description;
        string date;
    }

    // table of all operations
    Operation[] operations;

    // Company roles
    enum Role {
        EquipmentManufacturer,
        PartManufacturer,
        Client
    }

    // Company object
    struct Company {
        string name;
        Role role;
    }

    // Companies will interact with the contract
    mapping (address => Company) companies;


    // List of events
    event PartCreated(uint NftId);
    event CycleChainRoleGiven(address _address);
    event EquipmentManufacturerRoleGiven(address _address);
    event PartManufacturerRoleGiven(address _address);
    event ClientRoleGiven(address _address);
    event PartInstalledOnEquipment(string _partSerialNumber, string _equipmentSerialNumber);
    //event PartRemovedFromEquipment(uint partId, uint equipmentId);
    event EquipmentCreated(string equipmentId);
    //event EquipmentDeleted(uint equipmentId);
    event partListed(uint partId, uint price);
    event partDelisted(uint partId);

    constructor() ERC721("Part", "CC") {}


    /// @notice Checks if the msg.sender is an equipment manufacturer
    modifier onlyEM() {
        require(companies[msg.sender].role == Role.EquipmentManufacturer, "You are not an equipment manufacturer.");
        _;
    }

    /// @notice Checks if the msg.sender is a part manufacturer
    modifier onlyPM() {
        require(companies[msg.sender].role == Role.EquipmentManufacturer, "You are not a part manufacturer.");
        _;
    }

    /// @notice Checks if the msg.sender is a client
    modifier onlyC() {
        require(companies[msg.sender].role == Role.EquipmentManufacturer, "You are not a client.");
        _;
    }

    
    // ::::::::::::: GETTERS ::::::::::::: //

    function getAllParts() public view returns (Part[] memory) {
        uint len = nftIds.length;
        Part[] memory partsArray = new Part[](len);

        for (uint i=0; i<len; i++) {
            partsArray[i] = parts[nftIds[i]];
        }
        return partsArray;
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


    // ::::::::::::: SETTERS ::::::::::::: //

    /// @notice Adds an equipment to the equipments mapping and update the equipmentsSerialNumbers array
    /// @param _serialNumber Serial Number
    /// @param _category Category
    /// @param _manufacturer Manufacturer
    /// @param _owner The owner of the equipment (company name)
    /// @param _model Equipment model
    /// @param _photoURL Photo URL
    function addEquipment(string memory _serialNumber, string memory _category, string memory _manufacturer, string memory _owner, string memory _model, string memory _photoURL) public onlyEM {
      Equipment memory eq;
      eq.serialNumber = _serialNumber;
      eq.category = _category;
      eq.manufacturer = _manufacturer;
      eq.owner = _owner;
      eq.model = _model;
      eq.photoURL = _photoURL;
      eq.isValue = true;

      equipments[_serialNumber] = eq;
      equipmentsSerialNumbers.push(_serialNumber);

      emit EquipmentCreated(_serialNumber);
    }

    /// @notice Adds a part to the parts mapping and update the nftIds array
    /// @param _nftId The NFT id related to the part
    /// @param _serialNumber serial number
    /// @param _category Category
    /// @param _model Model
    /// @param _manufacturer Manufacturer
    function addPart(uint _nftId, string memory _serialNumber, string memory _category, string memory _model, string memory _manufacturer) internal {
      Part memory p;
      p.serialNumber = _serialNumber;
      p.category = _category;
      p.model = _model;
      p.manufacturer = _manufacturer;
      p.isListed = false;
      p.listedPrice = 0;
      p.isValue = true;

      parts[_nftId] = p;
      nftIds.push(_nftId);
    }

    /// @notice Sets an assembly in the assemblies mapping (existing values are replaced)
    /// @param _equipmentSerialNumber Equipment's serial number
    /// @param _partsSerialNumbers An array of serial numbers of the parts assembled in the equipement
    function setAssembly(string memory _equipmentSerialNumber, string[] memory _partsSerialNumbers) internal {
      assemblies[_equipmentSerialNumber].equipmentSerialNumber = _equipmentSerialNumber;
      assemblies[_equipmentSerialNumber].partsSerialNumbers = _partsSerialNumbers;
    }

    /// @notice Adds a part to an assembly (or creates he assembly if it doesn't exist)
    /// @param _equipmentSerialNumber The serial number of the equipment
    /// @param _partSerialNumber The serial number of the part to be removed
    function addPartToAssembly(string memory _equipmentSerialNumber, string memory _partSerialNumber) public {
      // TODO: Check if msg.sender is the owner of the part
      // TODO: Check if equipment exists
      // TODO: Check if part exists
      string[] memory partsArray = assemblies[_equipmentSerialNumber].partsSerialNumbers;
      uint len = partsArray.length;
      // TODO: Prevent adding a part that already exists in assembly
      partsArray[len] = _partSerialNumber;
      setAssembly(_equipmentSerialNumber, partsArray);

      emit PartInstalledOnEquipment(_partSerialNumber, _equipmentSerialNumber);
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

      //emit PartInstalledOnEquipment(_partSerialNumber, _equipmentSerialNumber);
    }
    */

    /// @notice Adds a company to the companies mapping
    function addCompany(string memory _name, address _address) public onlyOwner {
      Company memory comp;
      comp.name = _name;
      comp.role = Role.Client;
      companies[_address] = comp;
    }

    /// @notice Sets the company role to "EquipmentManufacturer"
    /// @param _address The address used by the company
    function setRoleToEquipmentManfacturer(address _address) public onlyOwner {
      companies[_address].role = Role.EquipmentManufacturer;
      emit EquipmentManufacturerRoleGiven(_address);
    }

    /// @notice Sets the company role to "PartManfacturer"
    /// @param _address The address used by the company
    function setRoleToPartManfacturer(address _address) public onlyOwner {
      companies[_address].role = Role.PartManufacturer;
      emit PartManufacturerRoleGiven(_address);
    }

    /// @notice Sets the company role to "Client"
    /// @param _address The address used by the company
    function setRoleToClient(address _address) public onlyOwner {
      companies[_address].role = Role.Client;
      emit ClientRoleGiven(_address);
    }



    // ::::::::::::: FUNCTIONS ::::::::::::: //

    /// @notice Make a token URI string from the info related to the part
    /// @return A token URI string
    function makeTokenURI(string  memory serialNumber, string  memory category, string  memory model, string  memory manufacturer) internal pure returns(string  memory) {
      require((bytes(serialNumber).length != 0 && bytes(category).length != 0 && bytes(model).length != 0 && bytes(manufacturer).length != 0), "All fields must be filled.");

      string  memory field1 = "{\"serialNumber\": \"";
      string  memory field2 = "\", \"category\": \"";
      string  memory field3 = "\", \"model\": \"";
      string  memory field4 = "\", \"manufacturer\": \"";
      string  memory field5 = "\"}";
      return string.concat(field1, serialNumber, field2, category, field3, model, field4, manufacturer, field5);
    }

    /// @notice As an equipment manufacturer, create a part NFT and transfer it to a part manufacturer
    /// @param _forManufacturer Address of the part producer that will get the Part (NFT)
    /// @return uint NFT's ID
    function createPart(address _forManufacturer, string  memory serialNumber, string  memory category, string  memory model, string   memory manufacturer) public onlyEM returns (uint256) {
        require(_forManufacturer != address(0), "ERC721 cannot be minted to the zero address");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_forManufacturer, newItemId);

        string  memory _tokenURI = makeTokenURI(serialNumber, category, model, manufacturer);
        _setTokenURI(newItemId, _tokenURI);

        addPart(newItemId, serialNumber, category, model, manufacturer);

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
  function updateListingPrice(uint _nftId, uint _price) public {
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




  /**

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
  function createEquipment(uint _equipmentId, string memory _equipmentCategory, string memory _equipmentModel, address _owner) external onlyProducers {
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
  */
}