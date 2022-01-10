//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract KeyStorage {
    address private owner;

    struct Point {
        uint256 x;
        uint256 y;
    }

    mapping(address => Point) public usersToKeys;

    event KeyPublished(address publisher);

    constructor() {
        owner = msg.sender;
    }

    function setUserKey(uint256 _x, uint256 _y) public {
        usersToKeys[msg.sender] = Point({x: _x, y: _y});
        emit KeyPublished(msg.sender);
    }

    function getUserKey(address userAddress)
        public
        view
        returns (Point memory)
    {
        require(userAddress != address(0), "wrong address");

        return usersToKeys[userAddress];
    }
}
