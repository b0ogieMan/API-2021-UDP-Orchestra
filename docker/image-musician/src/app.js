// UDP SERVER
const protocol = require('./protocol');
const udp = require('dgram');
const { randomUUID } = require('crypto');
const SEND_INTERVAL = 1000;
const client = udp.createSocket('udp4');
const uuid = randomUUID();

if(process.argv.length !== 3){
    console.error("An instrument must be provided as an argument")
    process.exit(1);
}
const instrument = process.argv[2];

if(protocol.INSTRUMENTS[instrument] === undefined){
    console.error("The instrument '" + instrument + "' is unknown")
    process.exit(1);
}

const sendSoundInterval = setInterval(() => sendSound(), SEND_INTERVAL);

const payload = JSON.stringify({
    uuid,
    sound : protocol.INSTRUMENTS[instrument],
});


function sendSound() {
    client.send(new Buffer(payload), protocol.PORT, protocol.MULTICAST_ADDRESS, (error => {
        if(error) {
            console.log(error);
            client.close();
            stopClient();
        }
        console.log('Payload sent: ' + payload + ' from port ' + client.address().port);
    }))
}

function stopClient() {
    clearInterval(sendSoundInterval);
}

setInterval(update)