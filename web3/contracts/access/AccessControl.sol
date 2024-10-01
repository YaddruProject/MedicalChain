// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../storage/MedicalStorage.sol";

contract AccessControl is MedicalStorage {
    modifier onlyAdmin() {
        require(userRoles[msg.sender].role == Role.ADMIN, "Only admin can perform this action");
        _;
    }

    modifier onlyDoctor() {
        require(userRoles[msg.sender].role == Role.DOCTOR, "Only doctor can perform this action");
        _;
    }

    modifier onlyPatient() {
        require(userRoles[msg.sender].role == Role.PATIENT, "Only patient can perform this action");
        _;
    }

    modifier onlyDoctorAndAdmin(address _doctorAddress) {
        require(userRoles[_doctorAddress].role == Role.DOCTOR, "Only doctor address should be provided");
        require(userRoles[msg.sender].role == Role.ADMIN || userRoles[msg.sender].role == Role.DOCTOR, "Only doctor or admin can perform this action");
        if (userRoles[_doctorAddress].role == Role.DOCTOR) {
            require(msg.sender == _doctorAddress, "Doctor can access only their own data");
        }
        _;
    }

    modifier onlyPatientAndDoctor(address _patientAddress) {
        require(userRoles[_patientAddress].role == Role.PATIENT, "Only patient address should be provided");
        require(userRoles[msg.sender].role == Role.DOCTOR || userRoles[msg.sender].role == Role.PATIENT, "Only patient or doctor with access can perform this action");
        if (userRoles[msg.sender].role == Role.DOCTOR) {
            require(hasPatientAccess(_patientAddress));
        }
        else {
            require(msg.sender == _patientAddress, "Patient can access only their own data");
        }
        _;
    }

    function grantRole(address user, Role role) internal {
        require(userRoles[user].role == Role.NONE, "User already has been granted a role");
        if (role == Role.DOCTOR) {
            require(userRoles[msg.sender].role == Role.ADMIN, "Only admin can grant doctor role");
        } else if (role == Role.PATIENT) {
            require(userRoles[msg.sender].role == Role.DOCTOR, "Only doctor can grant patient role");
        } else {
            revert("Invalid role");
        }
        userRoles[user] = RoleDetails({
            role: role,
            assignedBy: msg.sender,
            assignedAt: block.timestamp
        });
        emit RoleGranted(user, role, msg.sender, block.timestamp);
    }

    function revokeRole(address user) internal {
        RoleDetails memory currentDetails = userRoles[user];
        require(currentDetails.role != Role.NONE, "User has no role to revoke");
        require(currentDetails.role != Role.ADMIN, "User cannot revoke admin role");
        if (userRoles[msg.sender].role == Role.ADMIN) {
            emit RoleRevoked(user, currentDetails.role, msg.sender, block.timestamp);
            userRoles[user].role = Role.NONE;
        } else if (userRoles[msg.sender].role == Role.DOCTOR) {
            require(currentDetails.role == Role.PATIENT, "Only doctor can revoke patient role");
            emit RoleRevoked(user, currentDetails.role, msg.sender, block.timestamp);
            userRoles[user].role = Role.NONE;
        } else {
            revert("Only admin or doctor can revoke roles");
        }
    }

    function hasPatientAccess(address _patientAddress) internal view onlyDoctor returns (bool) {
        return doctorAccessToPatient[msg.sender][_patientAddress];
    }
}
