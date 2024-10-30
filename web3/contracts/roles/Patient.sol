// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../structs/FileStructs.sol";
import "../access/AccessControl.sol";

contract Patient is AccessControl {
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

    function grantAccessToDoctor(address _doctorAddress) public onlyPatient {
        require(getRole(_doctorAddress) == Role.DOCTOR, "Doctor is not registered");
        doctorAccessToPatient[_doctorAddress][msg.sender] = true;
        emit AccessGranted(msg.sender, _doctorAddress);
    }

    function revokeAccessFromDoctor(address _doctorAddress) public onlyPatient {
        require(getRole(_doctorAddress) == Role.DOCTOR, "Doctor is not registered");
        require(doctorAccessToPatient[_doctorAddress][msg.sender], "Doctor does not have access");
        doctorAccessToPatient[_doctorAddress][msg.sender] = false;
        emit AccessRevoked(msg.sender, _doctorAddress);
    }
}
