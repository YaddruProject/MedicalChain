// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../structs/UserStructs.sol";
import "../structs/FileStructs.sol";
import "../access/AccessControl.sol";

contract General is AccessControl {
    function getPatientInfo(address _patientAddress) public view onlyPatientAndDoctor(_patientAddress) returns (UserStructs.Patient memory) {
        return patients[_patientAddress];
    }

    function updatePatientInfo(
        address _patientAddress,
        uint8 age,
        string memory contactNumber,
        string memory healthIssues,
        string memory bloodGroup,
        string memory profilePic
    ) public onlyPatientAndDoctor(_patientAddress) {
        patients[_patientAddress].age = age;
        patients[_patientAddress].contactNumber = contactNumber;
        patients[_patientAddress].healthIssues = healthIssues;
        patients[_patientAddress].bloodGroup = bloodGroup;
        patients[_patientAddress].profilePic = profilePic;
    }

    function getMedicalRecords(address _patientAddress) public view onlyPatientAndDoctor(_patientAddress) returns (FileStructs.FileData[] memory) {
        return patientRecords[_patientAddress];
    }

    function addMedicalRecord(
        address _patientAddress,
        string memory _fileName,
        string memory _fileDescription,
        string memory _fileFormat,
        string memory _fileSize,
        string memory _cid
    ) public onlyPatientAndDoctor(_patientAddress) {
        FileStructs.FileData memory newRecord = FileStructs.FileData({
            filename: _fileName,
            description: _fileDescription,
            fileFormat: _fileFormat,
            fileSize: _fileSize,
            createdAt: block.timestamp,
            createdBy: msg.sender,
            cid: _cid
        });
        patientRecords[_patientAddress].push(newRecord);
        emit NewRecordAdded(_patientAddress, _cid);
    }

    function getDoctorInfo(address _doctorAddress) public view returns (UserStructs.Doctor memory) {
        require(getRole(_doctorAddress) == Role.DOCTOR, "Doctor is not registered");
        return doctors[_doctorAddress];
    }

    function updateDoctorInfo(
        address _doctorAddress,
        uint8 _age,
        string memory _contactNumber,
        string memory _currentWorkingHospital,
        string memory _specialization,
        string memory _profilePic
    ) public onlyDoctorAndAdmin(_doctorAddress) {
        doctors[_doctorAddress].age = _age;
        doctors[_doctorAddress].contactNumber = _contactNumber;
        doctors[_doctorAddress].currentWorkingHospital = _currentWorkingHospital;
        doctors[_doctorAddress].specialization = _specialization;
        doctors[_doctorAddress].profilePic = _profilePic;
    }

    function getAllDoctors() public view returns (UserStructs.Doctor[] memory) {
        UserStructs.Doctor[] memory allDoctors = new UserStructs.Doctor[](doctorsList.length);
        for (uint i = 0; i < doctorsList.length; i++) {
            allDoctors[i] = doctors[doctorsList[i]];
        }
        return allDoctors;
    }
}
