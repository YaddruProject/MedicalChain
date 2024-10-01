// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library FileStructs {
    struct FileData {
        string filename;
        string description;
        string fileFormat;
        string fileSize;
        uint256 createdAt;
        address createdBy;
        string cid;
    }
}
