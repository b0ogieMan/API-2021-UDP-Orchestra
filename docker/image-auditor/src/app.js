// TCP SERVER


/* The auditor should include a TCP server and accept connection requests on
 port 2205.
After accepting a connection request, the auditor must send a JSON payload containing
the list of active musicians, with the following format (it can be a single line, without indentation):
 */

const net = require('net');
const udp = require('udp');
const port = 2205;
const tcpServer = new net.Server();
const udpServer = udp.createSocket('udp4');

const instruments = {
    "ti-ta-ti": "piano",
    "pouet": "trumpet",
    "trulu": "flute",
    "gzi-gzi": "violin",
    "boum-boum": "drum"
};

var activeArray = new Map();






tcpServer.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost: 2205`);
});

tcpServer.on('connection', function(socket) {
    console.log('A new connection has been established.');



});