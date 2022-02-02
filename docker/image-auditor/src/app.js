const net = require('net');
const udp = require('dgram');
const protocol = require('./protocol');
const tcpServer = new net.Server();
const udpServer = udp.createSocket('udp4');

const TCP_PORT = 2205;
const INTERVAL = 5000;

const activeMusicians = new Map();

udpServer.bind(protocol.PORT, () => {
    console.log('Subscribing to multicast group...');
    udpServer.addMembership(protocol.MULTICAST_ADDRESS);
});

udpServer.on('message', function(datagram, source) {

    // parse received data
    const musician = JSON.parse(datagram);

    // store date when musician was last active, same operation for both cases
    musician.lastActive = Date.now()

    // if in the map
    if (activeMusicians.has(musician.uuid)) {
        musician.activeSince = activeMusicians.get(musician.uuid).activeSince; // no
        // need to update activeSince
    } else {
        musician.activeSince = musician.lastActive; // new element so we need to add
        // a value to store the first
    }

    // find instrument associated with sound
    musician.instrument = Object.keys(protocol.INSTRUMENTS)
        .find((instrument) => protocol.INSTRUMENTS[instrument] === musician.sound);

    // Add or update the element with uuid === data.uuid
    activeMusicians.set(musician.uuid, musician);

    console.log('New datagram has arrived: ' + datagram + ' from source port: ' + source.port);
});

tcpServer.listen(TCP_PORT, function() {
    console.log(`Server listening for connection requests on socket localhost: ` + TCP_PORT);
});

tcpServer.on('connection', function(socket) {

    const content = Array.from(activeMusicians.entries());

    const lastActive = content.filter(([uuid, musician]) => {

        // using a predicate to check if musician has to be removed or not
        const active = Date.now() - musician.lastActive <= INTERVAL;
        if(!active)
            activeMusicians.delete(uuid);
        return active;

    })
        .map(([uuid, musician]) => ({ // create a new map from the updated
            // content
            uuid,
            instrument: musician.instrument,
            activeSince: new Date(musician.activeSince)
        }));


    // send the map to the client
    socket.write(JSON.stringify(lastActive));
    socket.end();
});