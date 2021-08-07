import { useState } from 'react';
import { ethers } from 'ethers';
import Guesser from './artifacts/contracts/Guesser.sol/Guesser.json';

const guesserAddress = process.env.REACT_APP_GUESSER_ADDRESS; // Make a .env file with your deployed contract address

function App() {
    const [guesses, setGuesses] = useState([]);
    const [numBy, setNumByValue] = useState('');
    const [_firstGuess, setFirstGuess] = useState(false);
    const [_gameEnded, setGameEnded] = useState(false);
    const [_feedbackMessage, updateFeedbackMessage] = useState('');
    const _guessNum = Math.floor(Math.random() * (100 - 1) + 1);
    const [numberToGuess] = useState(_guessNum);

    // Request Metamask access
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    /**
     * Gets the contract and reads the guess
     * @returns
     */
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

            // Guess array is behind by 1 when checked
            if (guesses.length === 4 || data === numberToGuess)
                setGameEnded(true);

            updateFeedbackMessage(
                data < numberToGuess
                    ? 'ℹ That guess was too low! 🔽'
                    : data > numberToGuess
                    ? 'ℹ That guess was too high! 🔼'
                    : 'Your guess was right! 🎉'
            );
        } catch (error) {
            updateFeedbackMessage(
                "You can't make that guess... try something else 🧙‍♂️"
            );
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

    /**
     * Performs a math operation on the smart contract
     * @param {string} type The type of math operation to do on a value
     * @returns
     */
    async function guessBy(type) {
        updateFeedbackMessage('');
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

    /**
     * Resets the game
     */
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

        // State resets
        setGuesses([]);
        setFirstGuess(false);
        setGameEnded(false);
        setNumByValue('');
        updateFeedbackMessage('');
    }

    return (
        <div className="App flex justify-center items-top h-screen pt-10 text-gray-200">
            <section className="App-header w-1/3">
                <h1 className="text-5xl font-bold mb-3">DIS-GUESS-TING</h1>
                <ol className="list-decimal ml-4 mb-4">
                    <li>I've picked a random number 1-100</li>
                    <li>
                        You get 5 tries to guess it by doing math on your
                        guesses
                    </li>
                    {/* <li>Winning by addition or subtraction rewards +1 NGT</li>
                    <li>
                        Winning by multiplication or division rewards +2 NGT
                    </li> */}
                    <li className="font-bold text-yellow-300">
                        FAILURE EXPOSES THE PLAYER TO SCP-096
                    </li>
                </ol>
                {guesses.length > 0 && (
                    <h3 className="m-1 font-bold text-yellow-200">
                        Previous Guesses: {guesses.join(' — ')}
                    </h3>
                )}
                {_gameEnded && (
                    <h3 className="m-1 font-bold text-xl">
                        The number was ✨ {numberToGuess} ✨
                    </h3>
                )}
                <input
                    className="border rounded border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent py-4 px-3 w-full text-purple-600 "
                    type="text"
                    value={numBy}
                    disabled={_gameEnded}
                    onChange={(e) => setNumByValue(e.target.value)}
                    placeholder="Enter a value"
                    autoFocus
                />
                <h2 className="my-2">{_feedbackMessage}</h2>
                <div className="pt-3 flex flex-auto gap-2 w-full">
                    <button
                        className="bg-purple-500 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 p-8  text-white disabled:opacity-60"
                        disabled={_gameEnded}
                        onClick={() => guessBy('add')}
                    >
                        Add (+)
                    </button>
                    <button
                        className="bg-purple-500 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 p-8 text-white disabled:opacity-60"
                        disabled={!_firstGuess || _gameEnded}
                        onClick={() => guessBy('subtract')}
                    >
                        Subtract (−)
                    </button>
                    <button
                        className="bg-purple-500 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 p-8 text-white disabled:opacity-60"
                        disabled={!_firstGuess || _gameEnded}
                        onClick={() => guessBy('multiply')}
                    >
                        Multiply (×)
                    </button>
                    <button
                        className="bg-purple-500 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 p-8 text-white disabled:opacity-60"
                        disabled={!_firstGuess || _gameEnded}
                        onClick={() => guessBy('divide')}
                    >
                        Divide (÷)
                    </button>
                    {_gameEnded && (
                        <button
                            className="bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 p-8 text-white disabled:opacity-60"
                            onClick={() => resetGuess()}
                        >
                            Reset ↺
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}

export default App;
