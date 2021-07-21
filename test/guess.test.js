/* eslint-disable no-undef */
/* eslint-disable jest/valid-expect */
const { expect } = require('chai');

// describe('Greeter', function () {
//     it("Should return the new greeting once it's changed", async function () {
//         const Greeter = await ethers.getContractFactory('Greeter');
//         const greeter = await Greeter.deploy('Hello, world!');
//         await greeter.deployed();

//         expect(await greeter.greet()).to.equal('Hello, world!');

//         const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

//         // wait until the transaction is mined
//         await setGreetingTx.wait();

//         expect(await greeter.greet()).to.equal('Hola, mundo!');
//     });
// });

// const _getGuesserContract = async () => {
//     const Guesser = await ethers.getContractFactory('Guesser');
//     return await Guesser.deploy();
// };

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
        // it('Should throw for underflow', async function () {
        //     await guesser.guessByAdd(23);
        //     await guesser.guessBySubtract(42);
        //     expect(await guesser.guessBySubtract(42)).to.throw(Error);
        // });

        it('Should subtract the guess correctly', async function () {
            await guesser.guessByAdd(23);
            await guesser.guessBySubtract(2);
            expect(await guesser.getGuess()).to.equal(21);
        });
    });

    describe('Guess by multiplying', function () {
        it('Should multiply the guess', async function () {
            await guesser.guessByAdd(1);
            await guesser.guessByMultiply(42);
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
