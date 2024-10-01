// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../access/AccessControl.sol";
import "../structs/UserStructs.sol";
import "../structs/FileStructs.sol";

contract Admin is AccessControl {
    constructor(
        address _addr,
        string memory _name,
        string memory _phoneNumber
    ) {
        admin = UserStructs.Admin(
            _addr,
            _name,
            _phoneNumber,
            ""
        );
        userRoles[_addr] = RoleDetails({
            role: Role.ADMIN,
            assignedBy: msg.sender,
            assignedAt: block.timestamp
        });
    }

    function getAdminInfo() public view onlyAdmin returns (UserStructs.Admin memory) {
        return admin;
    }

    function updateAdminInfo(
        string memory _name,
        string memory _phoneNumber,
        string memory _profilePic
    ) public onlyAdmin {
        admin.name = _name;
        admin.phoneNumber = _phoneNumber;
        admin.profilePic = _profilePic;
    }

    function registerDoctor(
        address _doctorAddress,
        string memory _name,
        uint8 _age,
        string memory _gender,
        string memory _contactNumber,
        string memory _currentWorkingHospital,
        string memory _specialization,
        string memory _profilePic
    ) public onlyAdmin {
        grantRole(_doctorAddress, Role.DOCTOR);
        doctorsList.push(_doctorAddress);
        doctors[_doctorAddress] = UserStructs.Doctor({
            addr: _doctorAddress,
            name: _name,
            age: _age,
            gender: _gender,
            contactNumber: _contactNumber,
            currentWorkingHospital: _currentWorkingHospital,
            specialization: _specialization,
            profilePic: _profilePic
        });

        emit DoctorRegistered(_doctorAddress, _name);
    }

    function revokeDoctor(address _doctorAddress) public onlyAdmin {
        require(userRoles[_doctorAddress].role == Role.DOCTOR, "Not a registered doctor");
        grantRole(_doctorAddress, Role.NONE);
        delete doctors[_doctorAddress];
        emit DoctorRevoked(_doctorAddress);
    }

    function revokePatient(address _patientAddress) public onlyAdmin {
        require(userRoles[_patientAddress].role == Role.PATIENT, "Not a registered patient");
        grantRole(_patientAddress, Role.NONE);
        delete doctors[_patientAddress];
        emit PatientRevoked(_patientAddress);
    }
}
