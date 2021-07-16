//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Guesser {
    uint8 guess;

    event Added(uint8 number);

    constructor() {
        guess = 0;
    }

    function getGuess() public view returns (uint8) {
        return guess;
    }

    function guessByAdd(uint8 _numToAdd) public {
        guess = guess + _numToAdd;
        console.log("Added", _numToAdd);
    }

    function guessBySubtract(uint8 _numToSubtract) public {
        guess = guess - _numToSubtract;
    }

    function guessByMultiply(uint8 _numToMultiply) public {
        guess = guess + _numToMultiply;
    }

    function guessByDivide(uint8 _numToDivideBy) public {
        // No zero division craziness 🙅‍♂️
        if (guess == 0 || _numToDivideBy == 0) {
            guess = 0;
        } else {
            guess = guess / _numToDivideBy;
        }
    }
}
