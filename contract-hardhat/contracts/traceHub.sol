// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/AccessControl.sol";
import {ITraceAgreementFactory} from "./factory/traceAgreementFactory.sol";
import {ITraceAgreement} from "./traceAgreement.sol";


contract TraceHub is AccessControl {

    event DeafultAdminChanged(address indexed newDefaultAdmin);
    event ProposalAccepted(bool indexed accepted);
    struct Agreement {
        address traceAgreementContract;
        uint id;
        uint createdAt;
        string uri ;
        bytes32 [] nullifiers;
        string encryptionKey;
    }

    mapping(address => mapping(bytes32 => bool)) nullSpent;
    mapping (uint => address) idToAgreement;
    mapping (address => bool) supplierApproved;
    mapping (address => bool) proofGenerated;
    mapping (address => mapping(bytes32 => bool)) nullifierExist;
    Agreement[] agreementLog;
    
    address traceFactory;

    bytes32 public constant HUB_ADMIN = keccak256("HUB_ADMIN");
    
    modifier onlyDefaultAdmin(){
        require(checkDeafultAdmin(msg.sender), "You are not Default Admin");
        _;
    }

    /**
        @dev agreement store storage
     */
    mapping(address =>  Agreement) agreementsStore;

    constructor(address hubAdmin){
        _setupRole(DEFAULT_ADMIN_ROLE, hubAdmin);
       _setupRole(HUB_ADMIN, hubAdmin);
    }

    function updatAgreementLog(address _traceAgreement, string calldata agreementUri, bytes32[] calldata _nullifiers, uint id, string memory enKey) external {
        require( _traceAgreement != address(0), "invalid Agreement Address");
        require(msg.sender == traceFactory, "only traceFactory can update agreement log");
        Agreement memory _newAgreement = Agreement(_traceAgreement, id, block.timestamp, agreementUri, _nullifiers, enKey);
        agreementLog.push(_newAgreement);
        idToAgreement[id] =  _traceAgreement; 
    }

    function acceptProposal(address traceAddress) external {
        require(msg.sender == ITraceAgreement(traceAddress).getSupplier(), "not supplier");
        require(supplierApproved[traceAddress] == false, "Supplier already approved");
        supplierApproved[traceAddress] = true;
        emit ProposalAccepted(true);
    }

    function addFactory (address _traceFactory) external onlyDefaultAdmin {
        traceFactory = _traceFactory;
    }

    function updatAgreementUri(address _traceAgreement, string calldata agreementUri) external onlyDefaultAdmin {
        require( _traceAgreement != address(0), "invalid Agreement Address");
        agreementsStore[_traceAgreement].uri = agreementUri;
    }

    function zkProof(address traceAddress, bytes32 nullifier) external {
        require(msg.sender == ITraceAgreement(traceAddress).getTraceAdmin(), "un auth: not admin");
        require(proofGenerated[traceAddress] == false, "ZKP already generated");
        require(nullifierExist[traceAddress][nullifier] == false, "Nullifier already exist");
        proofGenerated[traceAddress] = true;
        nullifierExist[traceAddress][nullifier] = true;
    }

    function initiateAgreement(address traceAddress, bytes32 nullifier) external {
        require(msg.sender == ITraceAgreement(traceAddress).getTraceAdmin(), "un auth: not admin");
        require(this.checkNullExist(traceAddress,nullifier) == true, "Invalid Nullifier");
        bool success = ITraceAgreement(traceAddress).activate();
        require(success);
    }

    function checkNullExist(address traceAddress, bytes32 nullifier) external view returns(bool){
        return nullifierExist[traceAddress][nullifier];
    }

    function getAgreementId(address _traceAgreement) public view returns (uint) {
        uint id = agreementsStore[_traceAgreement].id;
        return id;
    }

    function getTraceAddress(uint id) public view returns(address){
        return idToAgreement[id];
    }

    function getAgreementUri(address _traceAgreement) external view returns (string memory) {
        return agreementsStore[_traceAgreement].uri;
    }

    function getEncryptionKey(address _traceAgreement) external view returns (string memory) {
        return agreementsStore[_traceAgreement].encryptionKey;
    }

    function getAgreementDetails(address _traceAgreement) public view returns (address, uint, uint) {
        Agreement memory newAgreement = agreementsStore[_traceAgreement];
        return (newAgreement.traceAgreementContract, newAgreement.id, newAgreement.createdAt);
    }

    function getAgreementLog() external view returns (Agreement[] memory) {
        return agreementLog;
    }

    function checkSupplierApproved(address traceAddress) external view returns(bool){
        return supplierApproved[traceAddress];
    }

    function checkNullifier(address _traceAgreement, bytes32 _nullifier) external view returns (bool) {
        bool spent =  nullSpent[_traceAgreement][_nullifier];
        return spent;
    }

    function checkNullLength(address _traceAgreement) external view returns (uint) {
        bytes32[] memory nullifiers = agreementsStore[_traceAgreement].nullifiers;
        return nullifiers.length;
    }

    function grantAdminRole(address hubAdmin) external onlyDefaultAdmin {
        grantRole(HUB_ADMIN, hubAdmin);
    }

    function removeRole(address addr) external onlyDefaultAdmin {
        revokeRole(HUB_ADMIN, addr);
    }

    function changeDeafultAdmin(address newDeafultAdmin) external onlyDefaultAdmin{
        grantRole(DEFAULT_ADMIN_ROLE, newDeafultAdmin);
        renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
        emit DeafultAdminChanged(newDeafultAdmin);
    }

    function updateNullifier(address _traceAgreement, bytes32 _nullifier) external returns(bool) {
        require(msg.sender == _traceAgreement, "only traceAgreement can update nullifier");
        
        if (nullSpent[_traceAgreement][_nullifier] == false) {
            nullSpent[_traceAgreement][_nullifier] = true;
        } 

        return true;
    }

    function checkHubAdmin(address hubAdmin) public view returns(bool){
       return hasRole(HUB_ADMIN, hubAdmin);
    }

    function checkDeafultAdmin(address addr) public view returns(bool){
        return hasRole(DEFAULT_ADMIN_ROLE, addr);
    }

}

interface ITraceHub {
    function updatAgreementLog(address _traceAgreement, string calldata agreementUri, bytes32[] calldata _nullifiers, uint id, string memory enKey) external;
    function getAgreementId(address _traceAgreement) external view returns (uint);
    function getTraceAddress(uint id) external view returns(address);
    function getAgreementDetails(address traceAgreement) external view returns (address, uint, uint );
    function checkNullifier(address _traceAgreement, bytes32 _nullifier) external view returns (bool);
    function checkNullLength(address _traceAgreement) external view returns (uint);
    function updateNullifier(address _traceAgreement, bytes32 _nullifier) external returns (bool);
    function checkHubAdmin(address hubAdmin) external view returns(bool);
    function checkDeafultAdmin(address addr) external view returns(bool);
    function checkSupplierApproved(address traceAddress) external view returns(bool);
    function checkNullExist(address traceAddress, bytes32 nullifier) external view returns(bool);
}
