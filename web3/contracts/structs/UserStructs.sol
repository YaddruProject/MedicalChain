// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FileStructs.sol";

library UserStructs {
    struct Admin {
        address addr;
        string name;
        string phoneNumber;
        string profilePic;
    }

    struct Doctor {
        address addr;
        string name;
        uint8 age;
        string gender;
        string contactNumber;
        string currentWorkingHospital;
        string specialization;
        string profilePic;
    }

    struct Patient {
        address addr;
        string name;
        uint8 age;
        string gender;
        string contactNumber;
        string healthIssues;
        string bloodGroup;
        string aadharNumber;
        string profilePic;
    }
}
