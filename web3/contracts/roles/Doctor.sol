// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../structs/UserStructs.sol";
import "../structs/FileStructs.sol";
import "../access/AccessControl.sol";

contract Doctor is AccessControl {
    function getEncryptedSecretKey(address _patientAddress) public view onlyDoctor returns (string memory) {
        require(hasPatientAccess(_patientAddress), "Doctor does not have access");
        return doctorEncryptedPatientKeys[msg.sender][_patientAddress];
    }

    function registerPatient(
        address _patientAddress,
        string memory _name,
        uint8 _age,
        string memory _gender,
        string memory _email,
        string memory _contactNumber,
        string memory _healthIssues,
        string memory _bloodGroup,
        string memory _aadharNumber,
        string memory _profilePic
    ) public onlyDoctor {
        grantRole(_patientAddress, Role.PATIENT);
        patientsList.push(_patientAddress);
        patients[_patientAddress] = UserStructs.Patient({
            addr: _patientAddress,
            name: _name,
            age: _age,
            gender: _gender,
            email: _email,
            contactNumber: _contactNumber,
            healthIssues: _healthIssues,
            bloodGroup: _bloodGroup,
            aadharNumber: _aadharNumber,
            profilePic: _profilePic
        });
        emit PatientRegistered(_patientAddress, _name);
    }

    function listPatientsWithAccess() public view onlyDoctor returns (address[] memory) {
        address[] memory accessiblePatients = new address[](patientsList.length);
        uint count = 0;
        for (uint i = 0; i < patientsList.length; i++) {
            if (userRoles[patientsList[i]].role == Role.PATIENT && hasPatientAccess(patientsList[i])) {
                accessiblePatients[count++] = patients[patientsList[i]].addr;
            }
        }
        address[] memory result = new address[](count);
        for (uint j = 0; j < count; j++) {
            result[j] = accessiblePatients[j];
        }
        return result;
    }

    function getPatientEncryptedKey(address _patientAddress) public view onlyDoctor returns (string memory) {
        require(hasPatientAccess(_patientAddress), "Doctor does not have access");
        return doctorEncryptedPatientKeys[msg.sender][_patientAddress];
    }
}
