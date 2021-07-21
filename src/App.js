// import logo from './logo.svg';s
import { useState } from 'react';
import { ethers } from 'ethers';
import Guesser from './artifacts/contracts/Guesser.sol/Guesser.json';

const guesserAddress = '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318';

function App() {
    const [guess, setGuessValue] = useState(0);

    // Request Metamask access
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    // Get the contract and read the guess
    async function fetchGuess() {
        if (typeof window.ethereum === 'undefined') return;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
            guesserAddress,
            Guesser.abi,
            provider
        );
        try {
            const data = await contract.getGuess();
            console.log('data:', data);
        } catch (error) {
            console.error(error);
        }
    }

    // Wrap all the operations so I avoid writing multiple functions
    // const operations = {
    //     add: async (contract) => await contract.guessByAdd(guess),
    //     subtract: async (contract) => await contract.guessBySubtract(guess),
    //     multiply: async (contract) => await contract.guessByMultiply(guess),
    //     divide: async (contract) => await contract.guessByDivide(guess),
    // };

    // One guess function to rule them all
    async function guessByAdd() {
        if (!guess) return;
        if (typeof window.ethereum === 'undefined') return;
        await requestAccount();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            guesserAddress,
            Guesser.abi,
            signer
        );

        const transaction = await contract.guessByAdd(parseInt(guess));
        await transaction.wait();
        fetchGuess();
    }

    return (
        <div className="App">
            <header className="App-header">
                <input
                    onChange={(e) => setGuessValue(e.target.value)}
                    placeholder="Enter a value"
                />
                <button onClick={guessByAdd}>Add</button>
                {/* <button onClick={runGuessOperation('subtract')}>
                    Subtract
                </button>
                <button onClick={runGuessOperation('multiply')}>
                    Multiply
                </button>
                <button onClick={runGuessOperation('divide')}>Divide</button> */}
            </header>
        </div>
    );
}

export default App;
