require('dotenv').config();
const { Web3 } = require('web3');

const web3 = new Web3('https://goerli.infura.io/v3/ef76fe8d28bd45859233faf7b7bf1b94');

const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Ping","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"}],"name":"Pong","type":"event"},{"inputs":[],"name":"ping","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pinger","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_txHash","type":"bytes32"}],"name":"pong","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const contractAddress = '0xE7af13bcc36280C16B8044CdaB85534a108DF9cc';

const contract = new web3.eth.Contract(contractABI, contractAddress);

const account = '0x5e5AEb09aDF5848612ae6fE5c09F43Df0b6e65A4';
const privateKey = process.env.PRIVATE_KEY;

async function main() {
    const gasEstimate = await contract.methods.ping().estimateGas({ from: account });

    const tx = {
        from: account,
        gas: gasEstimate,
        gasPrice: web3.utils.toWei('10', 'gwei'),
        to: contractAddress,
        data: contract.methods.ping().encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction sent with hash: ${receipt.transactionHash}`);
}

main().catch(console.error);