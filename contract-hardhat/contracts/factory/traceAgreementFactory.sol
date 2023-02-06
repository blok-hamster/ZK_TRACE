// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import {TraceAgreement} from "../traceAgreement.sol";
import {ITraceHub} from "../traceHub.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract TraceAgreementFactory is Ownable{
    
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
    constructor(address _traceHub) {
        traceHub = _traceHub;
    }
    
    function newTraceAgreement(bytes32 _verifierRoot, bytes32 _initiatorRoot, bytes32[] calldata _nullifiers, string calldata agreementUri ) public returns(address){
        uint id = agreementId;
        TraceAgreement _traceAgreement = new TraceAgreement(_verifierRoot, _initiatorRoot,traceHub);
        TraceAgreementDetails memory _traceDetails = TraceAgreementDetails({verifierRoot: _verifierRoot, initiatorRoot: _initiatorRoot, nullifiers: _nullifiers, agreementUri: agreementUri, agreementId: id});
        traceDetails[address(_traceAgreement)] = _traceDetails;
        ITraceHub(traceHub).updatAgreementLog(address(_traceAgreement), agreementUri, _nullifiers);
        idToAddress[agreementId] = address(_traceAgreement);
        agreementId++;
        emit AgreementCreated(block.timestamp, address(_traceAgreement));
        return address(_traceAgreement);
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