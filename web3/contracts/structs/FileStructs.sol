// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library FileStructs {
    struct FileData {
        string filename;
        string description;
        string fileFormat;
        uint256 fileSize;
        string sha256;
        uint256 createdAt;
        address createdBy;
        uint256 updatedAt;
        address lastUpdatedBy;
        string cid;
        string sig;
    }
}
