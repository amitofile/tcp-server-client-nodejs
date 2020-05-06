/**
 * Simple server script in TCP
 * @author amitp
 * @version 1.0.0
 * @since 20200507
 */

const Net = require('net');
const server = new Net.Server();

const PORT = 8081;
const SOCKET_TIMEOUT = 60000;

server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});

server.on('connection', (socket) => {
    console.log(`new connection: ${socket.address().address}`);
    socket.write('Hello, from server.');

    socket.on('data', (data) => {
        console.log(`Client: ${data.toString()}`);
    });

    socket.on('end', () => {
        console.log('connection closed.');
    });

    socket.on('error', (er) => {
        console.log(`Socket: ${er}`);
    });

    //Uncomment only if you want to forcefully disconnect idle sockets.
    //Socket timeout will not work if heartbeat is on.
    ///*
    socket.setTimeout(SOCKET_TIMEOUT);
    socket.on('timeout', () => {
        console.log('Socket timeout.');
        socket.end();
    });
    //*/
});

server.on('error', (er) => {
    console.log(`Server: ${er}`);
});
