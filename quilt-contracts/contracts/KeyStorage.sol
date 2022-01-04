//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract KeyStorage {
    mapping(address => uint256) public usersToKeys;
    string private greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function setUserKey(uint256 newPublicKey) public {
        usersToKeys[msg.sender] = newPublicKey;
    }

    function getUserKey(address userAddress) public view returns (uint256) {
        require(userAddress != address(0), "wrong address");

        return usersToKeys[userAddress];
    }
}
