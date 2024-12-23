// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Analytics {
    uint256 public transactionCount;
    
    event TransactionSent(address indexed sender, uint256 count);

    constructor() {
        transactionCount = 0;
    }

    function sendTransaction() public {
        transactionCount++;
        emit TransactionSent(msg.sender, transactionCount);
    }
}
