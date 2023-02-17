// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {ITraceHub} from "./traceHub.sol";
import {ITraceAgreementFactory} from "./factory/traceAgreementFactory.sol";


contract TraceAgreement {
    
    mapping (string => bytes32) merkelRoots; // holds the verifiers addresses
    event Verified(uint indexed signCount , bool indexed verified);
    
    address public traceHub;
    address traceAdmin;
    address factoryAddress;
    address supplier;

    struct Agreement {
        uint agreementId;
        uint createdAt;
    }
    Agreement agreements;
    AgreementStatus public status;
    bytes32[] nullifiers;

    enum AgreementStatus {Created, Active, Completed, Cancelled}

    uint signCount = 0;
    bool initilized;
    bool adminAdded;
    uint dataAvailibality;

    function addTraceAdmin(address _traceAdmin, address _supplier,address _factoryAddress, address _traceHub, uint _dataAvailibality) external {
        require( adminAdded == false, "Admin already updated");
        traceAdmin = _traceAdmin;
        supplier = _supplier;
        dataAvailibality = _dataAvailibality;
        traceHub = _traceHub;
        factoryAddress = _factoryAddress;
        status = AgreementStatus.Created;
        adminAdded = true;
    }
    

    function initilize(bytes32 _verifierRoot, bytes32[] calldata _nullifiers,string calldata agreementUri, string memory enKey) external {
        require(msg.sender == traceAdmin, "Un-auth: Not trace admin");
        require(!initilized, "already intilized");
        require(status == AgreementStatus.Created, "Agreement is already active");
        require(signCount == 0, "Agreement is already active");
        _updateRoot(_verifierRoot);
        nullifiers = _nullifiers;
         initilized = true;
        ITraceAgreementFactory(factoryAddress).initilizeAgreement( _verifierRoot, _nullifiers,agreementUri, address(this), enKey);
    }

    function _updateRoot(bytes32 verifierRoot) internal {
        string memory _verifierRoot = "verifierRoot";
        uint id = ITraceHub(traceHub).getAgreementId(address(this));

        merkelRoots[_verifierRoot] = verifierRoot;
        agreements.agreementId = id;
        agreements.createdAt = block.timestamp;
    }

    function verifyByOrder(bytes32[] memory _proof, bytes32 nullifier, bytes32 leaf) public  returns (bool) {
        bool verify;
        uint index_;

        for(uint i = 0; i<nullifiers.length; i++){
            if (nullifiers[i] == nullifier){
                index_ = i;
                break;
            }  
        }

        require(status == AgreementStatus.Active, "Trace Agreement is not active");
        if(index_ == 0) {
           require(signCount == 0, "first verifier already signed");
            (bool _verify) = verifierSign(_proof, leaf);
            if(!_verify){
                revert("invalid details");
            }
            ITraceHub(traceHub).updateNullifier(address(this), nullifier);
            signCount++;
            verify = _verify;  
        } else {
            require(index_ == signCount, "Not the next verifier");
            (bool _verify) = verifierSign(_proof, leaf);
            if(!_verify){
                revert("invalid details");
            }
            ITraceHub(traceHub).updateNullifier(address(this), nullifier);
            signCount++;  
            verify = _verify;  
        }
        _checkVerificationState();
        emit Verified(signCount, verify);  
        return verify;
    }

    function getDataAvailibality() external view returns(uint){
        return dataAvailibality;
    }

    function verifierSign(bytes32[] memory _proof, bytes32 leaf) internal view returns (bool) {
        bytes32 root = merkelRoots["verifierRoot"];
        return MerkleProof.verify(_proof, root, leaf);
    }

    function activate() external returns(bool){
    require (msg.sender  == traceHub, "only trace hub can activate agreement");
      status = AgreementStatus.Active;
      return true;
    }

    function checkState() public view returns(uint){
        return uint(status);
    }

    function _checkVerificationState() internal {
        if(signCount == ITraceHub(traceHub).checkNullLength(address(this))){
            status = AgreementStatus.Completed;
        } 
    }

    function getAgreementId() external view returns(uint){
        return agreements.agreementId;
    }

    function getSupplier() external view returns(address){
        return supplier;
    }

    function getTraceAdmin() external view returns(address){
        return traceAdmin;
    }
}

interface ITraceAgreement {
    function getSupplier() external view returns(address);
    function updateRoot(bytes32 verifierRoot, bytes32 initiatorRoot) external;
    function verifyByOrder(bytes32[] memory _proof, bytes32 nullifier) external view returns (bool);
    function getTraceAdmin() external view returns(address);
    function activate() external returns(bool);
}