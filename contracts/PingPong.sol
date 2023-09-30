pragma solidity 0.8.4;

/**
 * @title PingPong
 * @dev Exercise on syncing and transaction submission.
 */

// Contract deployed at: 0xE7af13bcc36280C16B8044CdaB85534a108DF9cc

contract PingPong {
    address public pinger;

    constructor() {
        pinger = msg.sender;
    }

    event Ping();
    event Pong(bytes32 txHash);

    function ping() external {
    // Removed the requirement that only the pinger can call this function.
    // Now, any address can call this function and emit the Ping event.
    emit Ping();
}

    function pong(bytes32 _txHash) external {
        emit Pong(_txHash);
    }
}