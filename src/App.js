// import logo from './logo.svg';s
import { useState } from 'react';
import { ethers } from 'ethers';
import Guesser from './artifacts/contracts/Guesser.sol/Guesser.json';

const guesserAddress = '0x9E545E3C0baAB3E08CdfD552C960A1050f373042';
const numberToGuess = Math.floor(Math.random() * (100 - 1) + 1);

function App() {
    const [guesses, setGuesses] = useState([]);
    const [numBy, setNumByValue] = useState('');
    const [_firstGuess, setFirstGuess] = useState(false);
    const [_gameEnded, setGameEnded] = useState(false);

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
            setGuesses((arr) => [...arr, data]);
            if (_firstGuess === false) setFirstGuess(true);
            if (guesses.length === 4) setGameEnded(true);
            console.log('data:', data);
            console.log('guesses', guesses);
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
        if (isNaN(parseInt(numBy))) return;
        if (numBy < 1 || numBy > 100) return;
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

    async function resetGuess() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            guesserAddress,
            Guesser.abi,
            signer
        );

        const reset = await contract.resetGuess();
        await reset.wait();

        //reset
        setGuesses([]);
        setFirstGuess(false);
        setGameEnded(false);
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
                <ol className="list-decimal ml-4">
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
                <h3 className="m-1 font-bold">
                    Number to match: {numberToGuess}
                </h3>
                <h3 className="m-1 font-bold">
                    Previous Guesses: {guesses.join(' ')}
                </h3>
                <input
                    className="border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent py-1 px-2"
                    disabled={_gameEnded}
                    onChange={(e) => setNumByValue(e.target.value)}
                    placeholder="Enter a value"
                />
                <button
                    className="bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 px-8 py-2 text-white disabled:opacity-60"
                    disabled={_gameEnded}
                    onClick={() => guessBy('add')}
                >
                    Add (+)
                </button>

                <button
                    className="bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 px-8 py-2 text-white disabled:opacity-60"
                    disabled={!_firstGuess || _gameEnded}
                    onClick={() => guessBy('subtract')}
                >
                    Subtract (−)
                </button>

                <button
                    className="bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 px-8 py-2 text-white disabled:opacity-60"
                    disabled={!_firstGuess || _gameEnded}
                    onClick={() => guessBy('multiply')}
                >
                    Multiply (×)
                </button>

                <button
                    className="bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 px-8 py-2 text-white disabled:opacity-60"
                    disabled={!_firstGuess || _gameEnded}
                    onClick={() => guessBy('divide')}
                >
                    Divide (÷)
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 px-8 py-2 text-white disabled:opacity-60"
                    disabled={!_gameEnded}
                    onClick={() => resetGuess()}
                >
                    Reset ↺
                </button>
            </header>
        </div>
    );
}

export default App;
