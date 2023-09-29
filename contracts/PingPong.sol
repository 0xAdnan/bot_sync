pragma solidity 0.8.4;

/**
 * @title PingPong
 * @dev Exercise on syncing and transaction submission.
 */
contract PingPong {
    address public pinger;

    constructor() {
        pinger = msg.sender;
    }

    event Ping();
    event Pong(bytes32 txHash);

    function ping() external {
        emit Ping();
    }

    function pong(bytes32 _txHash) external {
        emit Pong(_txHash);
    }
}