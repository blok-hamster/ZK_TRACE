// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import {TraceAgreement} from "../traceAgreement.sol";
import {ITraceHub} from "../traceHub.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract TraceAgreementFactory {
    
    address traceAgreementImplementation;
    event AgreementCreated(uint indexed time, address indexed agreementAddress);

    address public traceHub;
    mapping (uint => address) idToAddress;
    mapping (address => TraceAgreementDetails) traceDetails;
    struct TraceAgreementDetails {
        bytes32 verifierRoot;
        bytes32 initiatorRoot;
        bytes32[] nullifiers;
        string agreementUri;
        uint agreementId;
    }

    uint agreementId;
    constructor(address _traceHub, address _traceAgreementImplementation) {
        traceHub = _traceHub;
        traceAgreementImplementation = _traceAgreementImplementation;
    }
    
    function newTraceAgreement(bytes32 _verifierRoot, bytes32 _initiatorRoot, bytes32[] calldata _nullifiers, string calldata agreementUri ) public returns(address){
        uint id = agreementId;
        bytes32 salt = keccak256(abi.encodePacked(id, block.number, block.timestamp));
        address payable _traceAgreement = payable(Clones.cloneDeterministic(traceAgreementImplementation, salt));
        TraceAgreementDetails memory _traceDetails = TraceAgreementDetails({verifierRoot: _verifierRoot, initiatorRoot: _initiatorRoot, nullifiers: _nullifiers, agreementUri: agreementUri, agreementId: id});
        traceDetails[_traceAgreement] = _traceDetails;
        ITraceHub(traceHub).updatAgreementLog(_traceAgreement, agreementUri, _nullifiers);
        idToAddress[agreementId] = _traceAgreement;
        agreementId++;
        emit AgreementCreated(block.timestamp, _traceAgreement);
        return _traceAgreement;
    }

    function getAgreementDetais(address agreementAddress) external view returns(TraceAgreementDetails memory){
        return traceDetails[agreementAddress];
    }

    function getFactoryAddress() external view returns (address){
        return address(this);
    }

    function getTraceAddress(uint id) external view returns(address){
        return idToAddress[id];
    }
}