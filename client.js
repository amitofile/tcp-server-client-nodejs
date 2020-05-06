/**
 * Simple client script in TCP
 * @author amitp
 * @version 1.0.0
 * @since 20200507
 */

const Net = require('net');
const client = new Net.Socket();

const HOST = 'localhost';
const PORT = 8081;
const RECONNECT_INTERVAL = 5000;
const HEARTBEAT_INTERVAL = 2000;

var reconnect = false;

function connect() {
    console.log(`Trying to connect ${HOST}:${PORT}`);
    client.connect(PORT, HOST);
}

function startReconnect() {
    if (reconnect != false) return;
    reconnect = setInterval(connect, RECONNECT_INTERVAL);
}

function stopReconnect() {
    if (reconnect == false) return;
    clearInterval(reconnect);
    reconnect = false;
}

function heartbeat() {
    if (reconnect != false) {
        clearInterval(this);
        return;
    }
    console.log('Sending token...');
    client.write('I am alive.');
}

client.on('connect', () => {
    console.log(`Connected successfully to ${HOST}:${PORT}`);
    stopReconnect();
    setInterval(heartbeat, HEARTBEAT_INTERVAL);
});

client.on('data', (data) => {
    console.log(`Server: ${data.toString()}`);
});

client.on('error', (err) => {
    switch (err.code) {
        case 'ECONNRESET':
            console.error('Connection reset.');
            break;
        case 'ECONNREFUSED':
            console.error('Connection refused.');
            break;
        case 'EADDRINUSE':
            console.error('PORT already in use.');
            break;
        case 'EPIPE':
            console.error('Connection broken');
            break;
        case 'EALREADY':
            console.error('Connection already open.');
            break;
        default:
            console.error(err);
            break;
    }
});

client.on('end', () => {
    console.log('Disconnected from server.');
    startReconnect();
});

client.on('close', () => {
    console.log('Connection closed.');
    startReconnect();
});

connect();
