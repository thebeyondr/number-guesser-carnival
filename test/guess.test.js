/* eslint-disable no-undef */
/* eslint-disable jest/valid-expect */
const { expect } = require('chai');

describe('Guesser', function () {
    let guesser;

    beforeEach(async function () {
        const Guesser = await ethers.getContractFactory('Guesser');
        guesser = await Guesser.deploy();
        return await guesser.deployed();
    });

    describe('Guess by addition', function () {
        it('Should add to the current guess', async function () {
            await guesser.guessByAdd(42);
            expect(await guesser.getGuess()).to.equal(42);
        });
    });

    describe('Guess by subtraction', function () {
        it('Should subtract the guess correctly', async function () {
            await guesser.guessByAdd(44);
            await guesser.guessBySubtract(2);
            expect(await guesser.getGuess()).to.equal(42);
        });
    });

    describe('Guess by multiplying', function () {
        it('Should multiply the guess', async function () {
            await guesser.guessByAdd(21);
            await guesser.guessByMultiply(2);
            expect(await guesser.getGuess()).to.equal(42);
        });
    });

    describe('Guess by dividing', function () {
        it('Should divide the guess', async function () {
            await guesser.guessByAdd(42);
            await guesser.guessByDivide(2);
            expect(await guesser.getGuess()).to.equal(21);
        });
    });
});
