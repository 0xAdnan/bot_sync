const { Web3 } = require('web3');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const web3 = new Web3('https://goerli.infura.io/v3/ef76fe8d28bd45859233faf7b7bf1b94');
const botAddress = "0xE7af13bcc36280C16B8044CdaB85534a108DF9cc";
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "Ping",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "txHash",
                "type": "bytes32"
            }
        ],
        "name": "Pong",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "ping",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pinger",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_txHash",
                "type": "bytes32"
            }
        ],
        "name": "pong",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];


const contract = new web3.eth.Contract(abi, botAddress);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const myAddress = "0x5e5AEb09aDF5848612ae6fE5c09F43Df0b6e65A4";

// Function to handle the event
const handleEvent = async (event) => {
    console.log("Ping event detected!");
    const nonce = await web3.eth.getTransactionCount(myAddress);
    const { address, blockHash, blockNumber, transactionHash} = event;
    console.log({ address, blockHash, blockNumber, transactionHash, nonce });

    /**Get the current gas price and increase it by 10% so that we dont run into the error "replacement fee too low".*/
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = web3.utils.toHex(Math.round(Number(gasPrice) * 1.1));
    const txPong = contract.methods.pong(transactionHash).encodeABI();

    const txOptions = {
        nonce: nonce,
        gas: 70000,
        gasPrice: increasedGasPrice,
        to: contract.options.address,
        data: txPong
    };

    // Sign and send the pong transaction
    try {
        const signedTx = await web3.eth.accounts.signTransaction(txOptions, PRIVATE_KEY);
        const txPongHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(`Pong function successfully called at: ${txPongHash.transactionHash}`);
    } catch (error) {
        console.error(`Error during pong function call: ${error}`);
    }
    console.log("Searching for new ping events...");
};

// function to continuously check for new events
const logLoop = async (eventFilter, pollInterval) => {
    console.log("Searching for new ping events...");

    // running an infinte loop for event check
    while (true) {

        const newEntries = await web3.eth.getPastLogs(eventFilter);
        for (const ping of newEntries) {
            await handleEvent(ping);
        }

        // wait for the specified poll interval before checking again
        await new Promise(resolve => setTimeout(resolve, pollInterval * 1000));
    }
};


const main = async () => {
    const eventFilter = {
        address: contract.options.address,
        topics: [web3.utils.sha3('Ping()')]
    };

    try {
        await logLoop(eventFilter, 1);
    } catch (error) {
        console.error(error);
    }
};

main();