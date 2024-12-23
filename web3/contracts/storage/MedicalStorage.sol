// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../structs/UserStructs.sol";
import "../structs/FileStructs.sol";

contract MedicalStorage {
    enum Role { NONE, ADMIN, DOCTOR, PATIENT }

    struct RoleDetails {
        Role role;
        address assignedBy;
        uint256 assignedAt;
    }

    mapping(address => RoleDetails) internal userRoles;

    UserStructs.Admin internal admin;

    address[] internal doctorsList;
    address[] internal patientsList;

    mapping(address => UserStructs.Doctor) internal doctors;
    mapping(address => UserStructs.Patient) internal patients;
    mapping(address => FileStructs.FileData[]) internal patientRecords;
    mapping(address => mapping(address => bool)) internal doctorAccessToPatient;

    mapping(address => string) internal patientSecretKeys;
    mapping(address => mapping(address => string)) internal doctorEncryptedPatientKeys;

    mapping(address => string) internal publicKeys;
    mapping(address => string) internal privateKeys;

    event RoleGranted(address indexed user, Role role, address indexed grantedBy, uint256 assignedAt);
    event RoleRevoked(address indexed user, Role role, address indexed revokedBy, uint256 revokedAt);

    event DoctorRegistered(address indexed doctorAddress, string name);
    event DoctorRevoked(address indexed doctorAddress);

    event PatientRegistered(address indexed patientAddress, string name);
    event PatientRevoked(address indexed patientAddress);

    event NewRecordAdded(address indexed patientAddress, string cid);
    event RecordsUpdated(address indexed patientAddress);
    event AccessGranted(address indexed patientAddress, address indexed doctorAddress);
    event AccessRevoked(address indexed patientAddress, address indexed doctorAddress);
}
