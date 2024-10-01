// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "contracts/roles/Admin.sol";
import "contracts/roles/Doctor.sol";
import "contracts/roles/Patient.sol";
import "contracts/roles/General.sol";

contract MedicalChain is Admin, Doctor, Patient, General {
    constructor(address _addr, string memory _name, string memory _phoneNumber) Admin(_addr, _name, _phoneNumber) {}
}