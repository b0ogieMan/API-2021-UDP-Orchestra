// UDP SERVER

const udp = require('dgram');
const port = 5022;

const instruments = [
    "piano": "ti-ta-ti",
    "trumpet": "pouet",
    "flute": "trulu",
    "violin": "gzi-gzi",
    "drum": "boum-boum"
];

var client = udp.createSocket('udp4');

if(process.argv.length !== 3){
    console.error("An instrument must be provided as an argument")
    process.exit(1);
}
const instrument = process.argv[2];

if(instruments[instrument] === undefined){
    console.error("The instrument '" + instrument + "' is unknown")
    process.exit(1);
}

const sendSoundInterval = setInterval(() => sendSound(), 1000);

function sendSound() {
    client.send(instruments[instrument], port, '0.0.0.0', (error => {
        if(error) {
            console.log(error);
            client.close();
            stopClient();
        }
    }))
}

function stopClient() {
    clearInterval(sendSoundInterval);
}