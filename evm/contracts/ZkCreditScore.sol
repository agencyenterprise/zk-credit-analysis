// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';

contract ZkCreditScore is Ownable {
    event LoanRequestCreated(address indexed _requester, uint indexed _score);

    struct LoanRequest {
        address requester;
        string[] proofs;
        uint score;
    }

    LoanRequest[] public loanRequests;

    constructor() {}

    function addLoanRequest(address requester, string[] memory proofs, uint score) public onlyOwner {
        require(score <= 1000000, "Score is bigger than 1000000");
        emit LoanRequestCreated(requester, score);
        loanRequests.push(LoanRequest(requester, proofs, score));
    }

    function getLoanRequests() public view returns (LoanRequest[] memory) {
        return loanRequests;
    }
}
