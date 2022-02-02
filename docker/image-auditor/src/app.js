// TCP SERVER


/* The auditor should include a TCP server and accept connection requests on
 port 2205.
After accepting a connection request, the auditor must send a JSON payload containing
the list of active musicians, with the following format (it can be a single line, without indentation):
 */

const net = require('net');
const udp = require('dgram');
const protocol = require('./protocol');
const {INSTRUMENTS} = require("./protocol");
const tcpServer = new net.Server();
const udpServer = udp.createSocket('udp4');

const TCP_PORT = 2205;
const INTERVAL = 5000;

const activeMusicians = new Map();

udpServer.bind(protocol.PORT, () => {
    console.log('Subscribing to multicast group...');
    udpServer.addMembership(protocol.MULTICAST_ADDRESS);
});

udpServer.on('message', function(msg, source) {

    // parse received data
    const obj = JSON.parse(msg);

    // create new json object and add time property
    const musician = {
        obj,
        lastActive: Date.now(),
    };

    // find instrument associated with sound
    musician.instrument = Object.keys(protocol.INSTRUMENTS)
        .find((instrument) => protocol.INSTRUMENTS[instrument] === musician.sound);

    // if in the map 
    if (activeMusicians.has(data.uuid)) {
        musician.activeSince = activeMusicians.get(musician.uuid).activeSince; // no
        // need to update activeSince
    } else {
        musician.activeSince = musician.lastActive; // new element so we need to add
        // a value to store the first 
    }

    // Add or update the element with uuid === data.uuid
    activeMusicians.set(musician.uuid, musician);

    console.log('New datagram has arrived: ' + msg + ' from source port: ' + source.port);
});

tcpServer.listen(TCP_PORT, function() {
    console.log(`Server listening for connection requests on socket localhost: ` + TCP_PORT);
});

tcpServer.on('connection', function(socket) {
    const content = Array.from(activeMusicians.entries());
    const lastActive = content.filter(([uuid, musician]) => {
        const active = Date.now() - musician.lastActive <= INTERVAL;
        if(!active)
            activeMusicians.delete(uuid);
        return active;
    })
        .map(([uuid, musician]) => ({
            uuid,
            "instrument": musician.instrument,
            "activeSince": new Date(musician.activeSince)
        }));

    socket.write(JSON.stringify(lastActive));
    socket.end();
});