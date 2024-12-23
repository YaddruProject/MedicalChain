// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../structs/FileStructs.sol";
import "../access/AccessControl.sol";

contract Patient is AccessControl {
    function updatePatientSecretKey(string memory _newSecretKey) internal onlyPatient {
        patientSecretKeys[msg.sender] = _newSecretKey;
    }

    function updateEncryptedKeysForRemainingDoctors(
        address[] memory _remainingDoctors,
        string[] memory _encryptedKeysForRemainingDoctors
    ) internal onlyPatient {
        require(_remainingDoctors.length == _encryptedKeysForRemainingDoctors.length, "Mismatch between the number of doctors and encrypted keys");
        for (uint i = 0; i < _remainingDoctors.length; i++) {
            require(doctorAccessToPatient[_remainingDoctors[i]][msg.sender], "Doctor does not have access");
            doctorEncryptedPatientKeys[_remainingDoctors[i]][msg.sender] = _encryptedKeysForRemainingDoctors[i];
        }
    }

    function updatePatientRecords(
        string[] memory _sha256s,
        string[] memory _sigs,
        string[] memory _cids
    ) internal onlyPatient {
        uint256 recordCount = patientRecords[msg.sender].length;
        require(_sha256s.length == recordCount, "Mismatch between the number of records and MD5s");
        require(_sigs.length == recordCount, "Mismatch between the number of records and signatures");
        require(_cids.length == recordCount, "Mismatch between the number of records and CIDs");
        for (uint i = 0; i < recordCount; i++) {
            patientRecords[msg.sender][i].sha256 = _sha256s[i];
            patientRecords[msg.sender][i].sig = _sigs[i];
            patientRecords[msg.sender][i].cid = _cids[i];
            patientRecords[msg.sender][i].updatedAt = block.timestamp;
            patientRecords[msg.sender][i].lastUpdatedBy = msg.sender;
        }
        emit RecordsUpdated(msg.sender);
    }

    function setNewPatientSecretKey(string memory _secretKey) public onlyPatient {
        require(bytes(_secretKey).length > 0, "Secret key cannot be empty");
        require(bytes(patientSecretKeys[msg.sender]).length == 0, "Secret key already exists");
        patientSecretKeys[msg.sender] = _secretKey;
    }

    function getSecretKey() public view onlyPatient returns (string memory) {
        return patientSecretKeys[msg.sender];
    }

    function listDoctorsWithAccess() public view onlyPatient returns (address[] memory) {
        address[] memory accessibleDoctors = new address[](doctorsList.length);
        uint count = 0;
        for (uint i = 0; i < doctorsList.length; i++) {
            if (userRoles[doctorsList[i]].role == Role.DOCTOR && doctorHasAccess(doctorsList[i])) {
                accessibleDoctors[count++] = doctors[doctorsList[i]].addr;
            }
        }
        address[] memory result = new address[](count);
        for (uint j = 0; j < count; j++) {
            result[j] = accessibleDoctors[j];
        }
        return result;
    }

    function grantAccessToDoctor(address _doctorAddress, string memory _encryptedKey) public onlyPatient {
        require(getRole(_doctorAddress) == Role.DOCTOR, "Doctor is not registered");
        require(!doctorAccessToPatient[_doctorAddress][msg.sender], "Doctor already have access");
        doctorAccessToPatient[_doctorAddress][msg.sender] = true;
        doctorEncryptedPatientKeys[_doctorAddress][msg.sender] = _encryptedKey;
        emit AccessGranted(msg.sender, _doctorAddress);
    }

    function revokeAccessFromDoctor(
        address _doctorAddress,
        string memory _newSecretKey,
        address[] memory _remainingDoctors,
        string[] memory _encryptedKeysForRemainingDoctors,
        string[] memory _sha256s,
        string[] memory _sigs,
        string[] memory _cids
    ) public onlyPatient {
        require(getRole(_doctorAddress) == Role.DOCTOR, "Doctor is not registered");
        require(doctorAccessToPatient[_doctorAddress][msg.sender], "Doctor does not have access");
        doctorAccessToPatient[_doctorAddress][msg.sender] = false;
        delete doctorEncryptedPatientKeys[_doctorAddress][msg.sender];
        updatePatientSecretKey(_newSecretKey);
        updateEncryptedKeysForRemainingDoctors(_remainingDoctors, _encryptedKeysForRemainingDoctors);
        updatePatientRecords(_sha256s, _sigs, _cids);
        emit AccessRevoked(msg.sender, _doctorAddress);
    }
}
