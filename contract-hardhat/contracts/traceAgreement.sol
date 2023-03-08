// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {ITraceHub} from "./traceHub.sol";
import {ITraceAgreementFactory} from "./factory/traceAgreementFactory.sol";


contract TraceAgreement {
    
    event Verified(uint indexed signCount , bool indexed verified);
    mapping (string => bytes32) merkelRoots; // holds the verifiers addresses
    mapping (bytes32 => bool) hasVerified;
    
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
    string agreementUri;
    string en_key;

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
    

    function initilize(bytes32 _verifierRoot, bytes32[] calldata _nullifiers,string calldata _agreementUri, string memory enKey) external {
        uint id = ITraceAgreementFactory(factoryAddress).getId(address(this));
        require(msg.sender == traceAdmin, "Un-auth: Not trace admin");
        require(!initilized, "already intilized");
        require(status == AgreementStatus.Created, "Agreement is already active");
        require(signCount == 0, "Agreement is already active");
        agreementUri = _agreementUri;
        en_key = enKey;
        nullifiers = _nullifiers;
        initilized = true;
        _updateRoot(_verifierRoot, id);
        ITraceAgreementFactory(factoryAddress).initilizeAgreement( _verifierRoot, _nullifiers,agreementUri, address(this), enKey);
    }

    function _updateRoot(bytes32 verifierRoot, uint id) internal {
        string memory _verifierRoot = "verifierRoot";
        merkelRoots[_verifierRoot] = verifierRoot;
        agreements.agreementId = id;
        agreements.createdAt = block.timestamp;
    }

    function verifyByOrder(bytes32[] memory _proof, bytes32 nullifier, bytes32 leaf) public  returns (bool) {
        uint id = ITraceAgreementFactory(factoryAddress).getId(address(this));

        bool verify;
        uint index_;
        
        require(leaf == keccak256(abi.encodePacked(msg.sender)), "not autorized verifier");
        require(hasVerified[leaf] == false, "already verified");

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
            (bool success) = ITraceHub(traceHub).updateNullifier(address(this), nullifier);
            require(success);
            signCount++;
            verify = _verify;  
        } else {
            require(index_ == signCount, "Not the next verifier");
            (bool _verify) = verifierSign(_proof, leaf);
            if(!_verify){
                revert("invalid details");
            }
            (bool success) = ITraceHub(traceHub).updateNullifier(address(this), nullifier);
            require(success);
            signCount++;  
            verify = _verify;  
        }
        hasVerified[leaf] = true;
        _checkVerificationState();
        emit Verified(signCount, verify);

        if(this.checkState() == 4){
            bool os = ITraceAgreementFactory(factoryAddress).createInvoice(supplier, id, 1);
            bool _os = ITraceAgreementFactory(factoryAddress).createInvoice(traceAdmin, id, 1);
            require(os);
            require(_os);
        }

        return verify;
    }

    function updateAgreementUri(string calldata _agreementUri) external returns (bool){
        require(msg.sender == traceAdmin, "Not trace admin");
        agreementUri = _agreementUri;
        return true;
    }

    function getDataAvailibality() external view returns(uint){
        return dataAvailibality;
    }

    function getAgreementUri() external view returns(string memory){
        return agreementUri;
    }

    function getEncryptionKey() external view returns(string memory){
        return en_key;
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

    function _checkVerificationState() internal returns(bool) {
        bool os;
        if(signCount >= nullifiers.length){
            status = AgreementStatus.Completed;
            os = true;
        }
        return os;
    }

    function getAgreementId() external view returns(uint){
        return agreements.agreementId;
    }

    function getSupplier() external view returns(address){
        return supplier;
    }

    function checkIsInitilized() external view returns (bool){
        return initilized;
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
    function getAgreementUri() external view returns(string memory);
}