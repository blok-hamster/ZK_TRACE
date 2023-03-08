// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import {TraceAgreement} from "../traceAgreement.sol";
import {ITraceHub} from "../traceHub.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
contract TraceAgreementFactory is  ERC1155 {
    
    address traceAgreementImplementation;
    event AgreementCreated(uint indexed time, address indexed agreementAddress, uint indexed id);

    address public traceHub;
    mapping (uint => address) idToAddress;
    mapping (address => uint) ids;
    mapping (address => TraceAgreementDetails) traceDetails;
    struct TraceAgreementDetails {
        bytes32 verifierRoot;
        bytes32[] nullifiers;
        string agreementUri;
        uint agreementId;
    }

    uint agreementId;

    constructor(address _traceHub, address _traceAgreementImplementation) ERC1155("") {
        traceHub = _traceHub;
        traceAgreementImplementation = _traceAgreementImplementation;
    }
    
    function newTraceAgreement( address traceAdmin, address _supplier, uint dataAvailiblity) external returns (address, uint) {
        uint id = agreementId;
        bytes32 salt = keccak256(abi.encodePacked(id, block.number, block.timestamp));
        address payable _traceAgreement = payable(Clones.cloneDeterministic(traceAgreementImplementation, salt));
        TraceAgreement(_traceAgreement).addTraceAdmin(traceAdmin, _supplier, address(this), traceHub, dataAvailiblity);
        idToAddress[agreementId] = _traceAgreement;
        ids[_traceAgreement] = agreementId;
        agreementId++;
        emit AgreementCreated(block.timestamp, _traceAgreement, id);
        return (_traceAgreement, id);
    }

    function initilizeAgreement(bytes32 _verifierRoot,bytes32[] calldata _nullifiers,string calldata agreementUri, address  _traceAgreement, string memory enKey) external {
        require( _traceAgreement != address(0), "invalid Agreement Address");
        require(msg.sender == _traceAgreement, "caller must be trace agreement");
        require(ITraceHub(traceHub).checkSupplierApproved(_traceAgreement) == true, "supplier has not approved");
        uint id = this.getId(_traceAgreement);
        TraceAgreementDetails memory _traceDetails = TraceAgreementDetails({verifierRoot: _verifierRoot,  nullifiers: _nullifiers, agreementUri: agreementUri, agreementId: id});
        traceDetails[_traceAgreement] = _traceDetails;
        ITraceHub(traceHub).updatAgreementLog(_traceAgreement, agreementUri, _nullifiers, id, enKey);
    }

    function uri(uint256 tokenId) override public view returns(string memory){
        address t_address = idToAddress[tokenId];
        TraceAgreement traceAgreement = TraceAgreement(t_address);
        string memory cid = traceAgreement.getAgreementUri();
        return string(abi.encodePacked("https://ipfs.io/api/v0/dag/get/", cid));
    }

    function createInvoice(address account, uint256 id, uint256 amount) external returns (bool) {
        address t_address = idToAddress[id];
        TraceAgreement traceAgreement = TraceAgreement(t_address);
        require (msg.sender == t_address,"Un-Auth: Only TraceAgreement");
        require (traceAgreement.checkState() == 4, "Trace Agreement still Active");
        _mint(account, id, amount, "");
        return true;
    }

    function getAgreementDetais(address agreementAddress) external view returns(TraceAgreementDetails memory){
        return traceDetails[agreementAddress];
    }

    function getId(address agreementAddress) external view returns(uint){
        return ids[agreementAddress];
    }

    function getFactoryAddress() external view returns (address){
        return address(this);
    }

    function getTraceAddress(uint id) external view returns(address){
        return idToAddress[id];
    }
}

interface ITraceAgreementFactory{
        struct TraceAgreementDetails {
        bytes32 verifierRoot;
        bytes32[] nullifiers;
        string agreementUri;
        uint agreementId;
    }
    
    function initilizeAgreement(bytes32 _verifierRoot,bytes32[] calldata _nullifiers,string calldata agreementUri, address  _traceAgreement, string memory enKey) external ;
    function getAgreementDetais(address agreementAddress) external view returns(TraceAgreementDetails memory);
    function getId(address agreementAddress) external view returns(uint);
    function createInvoice(address account, uint256 id, uint256 amount) external returns (bool);
}