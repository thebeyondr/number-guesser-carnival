//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Guesser {
    uint8 guess;
    mapping(address => uint8) gamesPlayed;
    mapping(address => uint8) gamesWon;

    event GameWon(address player, uint8 timesWon);

    function resetGuess() public {
        guess = 0;
    }

    function getGuess() public view returns (uint8) {
        return guess;
    }

    function setWin() public {
        if (gamesWon[msg.sender] > 0)
            gamesWon[msg.sender] = gamesWon[msg.sender] + 1;
        else gamesWon[msg.sender] = 1;
        emit GameWon(msg.sender, gamesWon[msg.sender]);
    }

    function setGamePlayed() public {
        if (gamesPlayed[msg.sender] > 0)
            gamesPlayed[msg.sender] = gamesPlayed[msg.sender] + 1;
        else gamesPlayed[msg.sender] = 1;
    }

    function guessByAdd(uint8 _numToAdd) public {
        uint8 newGuess = guess + _numToAdd;
        require(newGuess <= 100, "Guess too high");
        require(newGuess >= 1, "Guess too low");
        guess = newGuess;
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
