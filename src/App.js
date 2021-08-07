// import logo from './logo.svg';s
import { useState } from 'react';
import { ethers } from 'ethers';
import Guesser from './artifacts/contracts/Guesser.sol/Guesser.json';

const guesserAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
    const [guesses, setGuesses] = useState([]);
    const [numBy, setNumByValue] = useState('');
    const [_firstGuess, setFirstGuess] = useState(false);
    const [_gameEnded, setGameEnded] = useState(false);
    const [_feedbackMessage, updateFeedbackMessage] = useState('');
    const _guessNum = Math.floor(Math.random() * (100 - 1) + 1);
    const [numberToGuess] = useState(_guessNum);

    // const numberToGuess = Math.floor(Math.random() * (100 - 1) + 1);

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
            console.log(numberToGuess, data);
            setGuesses((arr) => [...arr, data]);
            if (_firstGuess === false) setFirstGuess(true);
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

    // One guess function to rule them all
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
        setNumByValue('');
        updateFeedbackMessage('');
        // setNumberToGuess(Math.floor(Math.random() * (100 - 1) + 1));
    }

    return (
        <div className="App flex justify-center items-top h-screen pt-10 text-gray-200">
            <section className="App-header w-1/3">
                <h1 className="text-5xl font-bold mb-3">DIS-GUESS-TING</h1>
                {/* <button
                    className="bg-white border-4 border-gray-800 hover:bg-purple-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 px-8 py-2"
                    onClick={() =>}
                >
                    +
                </button> */}
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
