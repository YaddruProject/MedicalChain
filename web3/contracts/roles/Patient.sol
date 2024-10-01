// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../structs/FileStructs.sol";
import "../access/AccessControl.sol";

contract Patient is AccessControl {
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
