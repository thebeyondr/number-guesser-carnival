//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Guesser {
    uint8 guess;

    event Added(uint8 value, uint8 guess);

    function getGuess() public view returns (uint8) {
        return guess;
    }

    function guessByAdd(uint8 _numToAdd) public {
        uint8 newGuess = guess + _numToAdd;
        require(newGuess <= 100, "Guess too high");
        require(newGuess >= 1, "Guess too low");
        guess = newGuess;
        emit Added(_numToAdd, guess);
    }

    function guessBySubtract(uint8 _numToSubtract) public {
        uint8 newGuess = guess - _numToSubtract;
        require(newGuess <= 100, "Guess too high");
        require(newGuess >= 1, "Guess too low");
        guess = newGuess;
    }

    function guessByMultiply(uint8 _numToMultiply) public {
        uint8 newGuess = guess * _numToMultiply;
        require(newGuess <= 100, "Guess too high");
        require(newGuess >= 1, "Guess too low");
        guess = newGuess;
    }

    function guessByDivide(uint8 _numToDivideBy) public {
        uint8 newGuess = guess / _numToDivideBy;
        require(newGuess <= 100, "Guess too high");
        require(newGuess >= 1, "Guess too low");
        guess = newGuess;
    }
}
