const { ethers } = require('ethers');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/ef76fe8d28bd45859233faf7b7bf1b94');
const botAddress = "0xB78d3f861B7C942ffFE1Ed375A9EF3E237B9095b";
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

const contract = new ethers.Contract(botAddress, abi, provider);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const myAddress = "0xF3fDdD4F6B243B61c6d783011DA2d0E6c0BAbCe4";



const handleEvent = async (event) => {
    try {
        console.log(JSON.stringify(event));
        const txHash = event.transactionHash;
        const nonce = await provider.getTransactionCount(myAddress, 'pending');
        console.log(`This is the nonce right now: ${nonce}`);
        const gasPrice = await provider.getGasPrice();
        const txOptions = {
            nonce: ethers.utils.hexlify(nonce),
            gasLimit: ethers.utils.hexlify(70000),
            gasPrice: ethers.utils.hexlify(gasPrice),
        };

        const txPong = await contract.connect(wallet).pong(txHash);
        const signedTx = await wallet.signTransaction({
            to: contract.address,
            data: txPong.data,
            ...txOptions
        });
        const txPongHash = await provider.sendTransaction(signedTx);
        console.log(`Tx Pong successful! ${txPongHash.hash}`);
    } catch (error) {
        console.error(`Error handling event: ${error}`);
    }
};


const logLoop = async (eventFilter, pollInterval) => {
    while (true) {
        console.log("Checking for new entries...");
        const newEntries = await provider.getLogs(eventFilter);
        for (const ping of newEntries) {
            await handleEvent(ping);
        }
        await new Promise(resolve => setTimeout(resolve, pollInterval * 1000));
    }
};

const main = async () => {
    const eventFilter = contract.filters.Ping();
    try {
        await logLoop(eventFilter, 1);
    } catch (error) {
        console.error(error);
    }
};

main();