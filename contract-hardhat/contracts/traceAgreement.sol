// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ITraceHub} from "./traceHub.sol";


contract TraceAgreement is Pausable, Ownable {
    
    mapping (string => bytes32) merkelRoots; // holds the verifiers addresses
    address public traceHub;

    struct Agreement {
        uint agreementId;
        uint createdAt;
    }

    enum AgreementStatus {Created, Active, Completed, Cancelled}

    AgreementStatus public status;

    Agreement agreements;
    uint signCount = 0;
    bool initilized;
    

    function initilize(bytes32 _verifierRoot, bytes32 _initiatorRoot, address _traceHub) external {
        require(!initilize, "already intilized")
        _updateRoot(_verifierRoot, _initiatorRoot);
        traceHub = _traceHub;
        status = AgreementStatus.Created;
        transferOwnership(_traceHub);
        initilized = true;
    }


    function _updateRoot(bytes32 verifierRoot, bytes32 initiatorRoot) internal {
        string memory _verifierRoot = "verifierRoot";
        string memory _initiatorRoot = "initiatorRoot";
        uint id = ITraceHub(traceHub).getAgreementId(address(this));

        merkelRoots[_verifierRoot] = verifierRoot;
        merkelRoots[_initiatorRoot] = initiatorRoot;
        
        agreements.agreementId = id;
        agreements.createdAt = block.timestamp;
    }

    function activate() external  {
        require(status == AgreementStatus.Created, "Agreement is already active");
        require(signCount == 0, "Agreement is already active");
        status = AgreementStatus.Active;
    }

    function verifyByOrder(bytes32[] calldata _proof, bytes32 nullifier) public  returns (bool) {
        require(status == AgreementStatus.Active, "Trace Agreement is not active");
        (bool success, uint index) = ITraceHub(traceHub).checkNullifier(address(this), nullifier);
        if(index == 0) {
           require(signCount == 0, "Not the first verifier");
           require(success == false);
            (bool _verify) = verifierSign(_proof, msg.sender);
            if(!_verify){
                revert("Not verifier");
            }
            ITraceHub(traceHub).updateNullifier(address(this), nullifier);
            signCount++;
            _checkVerificationState();
            return _verify;  
        } else {
            require(index == signCount++, "Not the next verifier");
            require(success == false);
            (bool _verify) = verifierSign(_proof, msg.sender);
            if(!_verify){
                revert("Not verifier");
            }
            ITraceHub(traceHub).updateNullifier(address(this), nullifier);
            signCount++;
             _checkVerificationState();
            return _verify;  
        }    
        
    }

    function verifierSign(bytes32[] calldata _proof, address addr) internal view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(addr));
        bytes32 root = merkelRoots["verifierRoot"];
        return MerkleProof.verify(_proof, root, leaf);
    }

    function checkState() public view returns(uint){
        return uint(status);
    }

    function _checkVerificationState() internal {
        if(signCount >= ITraceHub(traceHub).checkNullLength(address(this))){
            status = AgreementStatus.Completed;
        } 
    }


    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function initiatorSign(bytes32[] calldata _proof, address addr) public view returns (bool) {
        bytes32 root = merkelRoots["initiatorRoot"];
        bytes32 leaf = keccak256(abi.encodePacked(_addr));
        return MerkleProof.verify(_proof, root, leaf);
    }

}

interface ITraceAgreement {
    function updateRoot(bytes32 verifierRoot, bytes32 initiatorRoot) external;
    function verifyByOrder(bytes32[] calldata _proof, bytes32 nullifier) external view returns (bool);
    function initiatorSign(bytes32[] calldata _proof, address addr) external view returns (bool);
}