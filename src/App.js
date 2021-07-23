// import logo from './logo.svg';s
import { useState } from 'react';
import { ethers } from 'ethers';
import Guesser from './artifacts/contracts/Guesser.sol/Guesser.json';

const guesserAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

function App() {
    const [guesses, addGuess] = useState([]);
    const [numBy, setNumByValue] = useState('');

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
            addGuess((arr) => [...arr, data]);
            console.log('data:', data);
        } catch (error) {
            console.error(error);
        }
    }

    // Wrap all the operations to avoid writing multiple functions
    const operations = {
        add: 'guessByAdd',
        subtract: 'guessBySubtract',
        multiply: 'guessByMultiply',
        divide: 'guessByDivide',
    };

    // One guess function to rule them all
    async function guessBy(type) {
        if (!numBy) return;
        if (typeof window.ethereum === 'undefined') return;
        await requestAccount();

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            guesserAddress,
            Guesser.abi,
            signer
        );

        const transaction = await contract[operations[type]](parseInt(numBy));
        await transaction.wait();
        fetchGuess();
    }

    return (
        <div className="App">
            <header className="App-header px-4">
                {/* <button
                    className="bg-white border-4 border-gray-800 hover:bg-purple-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 px-8 py-2"
                    onClick={() =>}
                >
                    +
                </button> */}
                <ol className="list-decimal">
                    <li>I pick a random number 1-100</li>
                    <li>
                        You get 5 tries to guess it by doing math on your
                        guesses
                    </li>
                    {/* <li>Winning by addition or subtraction rewards +1 NGT</li>
                    <li>
                        Winning by multiplication or division rewards +2 NGT
                    </li> */}
                    <li>FAILURE EXPOSES THE PLAYER TO SCP-096</li>
                </ol>
                <h3 className="m-2 font-bold">
                    Previous Guesses: {guesses.join(' ')}
                </h3>
                <input
                    className="border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent py-1"
                    onChange={(e) => setNumByValue(e.target.value)}
                    placeholder="Enter a value"
                />
                <button
                    className="bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 px-8 py-2 text-white"
                    onClick={() => guessBy('add')}
                >
                    Add
                </button>
                <button
                    className="bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 px-8 py-2 text-white"
                    onClick={() => guessBy('subtract')}
                >
                    Subtract
                </button>
                <button
                    className="bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 px-8 py-2 text-white"
                    onClick={() => guessBy('multiply')}
                >
                    Multiply
                </button>
                <button
                    className="bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 px-8 py-2 text-white"
                    onClick={() => guessBy('divide')}
                >
                    Divide
                </button>
            </header>
        </div>
    );
}

export default App;
