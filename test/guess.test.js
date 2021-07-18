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

describe('Guess By Adding', function () {
    it('Should add to the current guess', async function () {
        const Guesser = await ethers.getContractFactory('Guesser');
        const guesser = await Guesser.deploy();

        await guesser.deployed();
        await guesser.guessByAdd(23);
        expect(await guesser.getGuess()).to.equal(23);
    });
});
