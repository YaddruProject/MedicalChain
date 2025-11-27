// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../structs/UserStructs.sol";
import "../structs/FileStructs.sol";
import "../access/AccessControl.sol";

contract General is AccessControl {
    function setBiometrics(string memory _biometrics) public {
        require(bytes(_biometrics).length > 0, "Biometrics data is required");
        biometricsData[msg.sender] = _biometrics;
    }

    function getBiometrics() public view returns (string memory) {
        return biometricsData[msg.sender];
    }

    function setKeyPair(string memory _publicKey, string memory _privateKey) public {
        require(bytes(_publicKey).length > 0, "Public key is required");
        require(bytes(_privateKey).length > 0, "Private key is required");
        publicKeys[msg.sender] = _publicKey;
        privateKeys[msg.sender] = _privateKey;
    }

    function getPublicKey(address _userAddress) public view returns (string memory) {
        return publicKeys[_userAddress];
    }

    function getPrivateKey() public view returns (string memory) {
        return privateKeys[msg.sender];
    }

    function getPatientsCount() public view returns (uint) {
        return patientsList.length;
    }

    function getPatientInfo(address _patientAddress) public view onlyPatientAndDoctor(_patientAddress) returns (UserStructs.Patient memory) {
        return patients[_patientAddress];
    }

    function updatePatientInfo(
        address _patientAddress,
        uint8 _age,
        string memory _email,
        string memory _contactNumber,
        string memory _healthIssues,
        string memory _bloodGroup,
        string memory _profilePic
    ) public onlyPatientAndDoctor(_patientAddress) {
        patients[_patientAddress].age = _age;
        patients[_patientAddress].email = _email;
        patients[_patientAddress].contactNumber = _contactNumber;
        patients[_patientAddress].healthIssues = _healthIssues;
        patients[_patientAddress].bloodGroup = _bloodGroup;
        patients[_patientAddress].profilePic = _profilePic;
    }

    function getMedicalRecords(address _patientAddress) public view onlyPatientAndDoctor(_patientAddress) returns (FileStructs.FileData[] memory) {
        // If patient is calling, return all records
        if (msg.sender == _patientAddress) {
            return patientRecords[_patientAddress];
        }
        
        // If doctor is calling, filter by hierarchical classification code
        if (getRole(msg.sender) == Role.DOCTOR) {
            uint16 doctorCode = doctors[msg.sender].specializationCode;
            FileStructs.FileData[] memory allRecords = patientRecords[_patientAddress];
            FileStructs.FileData[] memory filtered = new FileStructs.FileData[](allRecords.length);
            uint count = 0;
            
            // If doctor has code 0 (All Specializations), grant access to all files
            if (doctorCode == 0) {
                return allRecords;
            }
            
            for (uint i = 0; i < allRecords.length; i++) {
                uint16 fileCode = allRecords[i].classificationCode;
                
                // If file has code 0 (All Specializations), all doctors can see it
                // OR hierarchical access check
                if (fileCode == 0 ||
                    fileCode == doctorCode ||
                    fileCode / 10 == doctorCode / 10 ||
                    fileCode / 100 == doctorCode / 100 ||
                    fileCode / 1000 == doctorCode / 1000) {
                    filtered[count++] = allRecords[i];
                }
            }
            
            // Resize array to actual count
            assembly {
                mstore(filtered, count)
            }
            
            return filtered;
        }
        
        return new FileStructs.FileData[](0);
    }

    function addMedicalRecord(
        address _patientAddress,
        string memory _fileName,
        string memory _fileDescription,
        string memory _fileFormat,
        uint256 _fileSize,
        string memory _sha256,
        string memory _cid,
        string memory _sig,
        uint16 _classificationCode
    ) public onlyPatientAndDoctor(_patientAddress) {
        FileStructs.FileData memory newRecord = FileStructs.FileData({
            filename: _fileName,
            description: _fileDescription,
            fileFormat: _fileFormat,
            fileSize: _fileSize,
            sha256: _sha256,
            createdAt: block.timestamp,
            createdBy: msg.sender,
            updatedAt: block.timestamp,
            lastUpdatedBy: msg.sender,
            cid: _cid,
            sig: _sig,
            classificationCode: _classificationCode
        });
        patientRecords[_patientAddress].push(newRecord);
        emit NewRecordAdded(_patientAddress, _cid);
    }

    function getDoctorsCount() public view returns (uint) {
        return doctorsList.length;
    }

    function getDoctorInfo(address _doctorAddress) public view returns (UserStructs.Doctor memory) {
        require(getRole(_doctorAddress) == Role.DOCTOR, "Doctor is not registered");
        return doctors[_doctorAddress];
    }

    function updateDoctorInfo(
        address _doctorAddress,
        uint8 _age,
        string memory _email,
        string memory _contactNumber,
        string memory _currentWorkingHospital,
        string memory _specialization,
        string memory _profilePic
    ) public onlyDoctorAndAdmin(_doctorAddress) {
        doctors[_doctorAddress].age = _age;
        doctors[_doctorAddress].email = _email;
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
