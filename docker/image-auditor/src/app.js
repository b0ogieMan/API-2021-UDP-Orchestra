// TCP SERVER


/* The auditor should include a TCP server and accept connection requests on
 port 2205.
After accepting a connection request, the auditor must send a JSON payload containing
the list of active musicians, with the following format (it can be a single line, without indentation):
 */

const net = require('net');
const udp = require('dgram');
const protocol = require('./protocol');

const TCP_PORT = 2205;
const INTERVAL = 5000;
const tcpServer = new net.Server();
const udpServer = udp.createSocket('udp4');

const activeMusicians = new Map();

udpServer.bind(protocol.PORT, () => {
    console.log('Subscribing to multicast group...');
    udpServer.addMembership(protocol.MULTICAST_ADDRESS);
});

udpServer.on('message', function(msg, source) {
    const obj = JSON.parse(msg);
    const data = {
        obj,
        lastHeard: Date.now(),
    };
    data.instrument = Object.keys(protocol.INSTRUMENTS)
        .find((instrument) => protocol.INSTRUMENTS[instrument] === data.sound);

    if (activeMusicians.has(data.uuid)) {
        data.lastSound = activeMusicians.get(data.uuid).lastSound;
    } else {
        data.lastSound = data.lastHeard;
    }
    // Add or update the element with uuid === data.uuid
    activeMusicians.set(data.uuid, data);

    console.log('New datagram has arrived: ' + msg + ' from source port: ' + source.port);
});

tcpServer.listen(TCP_PORT, function() {
    console.log(`Server listening for connection requests on socket localhost: ` + TCP_PORT);
});

tcpServer.on('connection', function(socket) {
    const content = Array.from(activeMusicians);
    const now = Date.now();

});