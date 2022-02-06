const express = require('express');
const db = require('./database/db');
const Circulation = require('./database/models/Circulation');
const app = express();
app.use(express.static(__dirname + "/public"));

const WebSocket = require('ws');
const five = require("johnny-five");
const http = require('http').Server(app);
const webSocketServer = new WebSocket.Server({ server: http });

const HOST = '0.0.0.0';
const PORT = 3000;

const board = new five.Board();
let status = false;

board.on('ready', function() {
    // Représente un feu horizontal
    const ledVerteH = new five.Led(13);
    const ledOrangeH = new five.Led(12);
    const ledRougeH = new five.Led(11);

    // Représente un feu vertical
    const ledRougeV = new five.Led(10);
    const ledOrangeV = new five.Led(9);
    const ledVerteV = new five.Led(8);

    // Composant émettant un bruit sonore
    const buzzer = new five.Piezo(2);

    // Bouton de switch des feux
    let button = new five.Button({
        board: board,
        pin: 7,
        holdtime: 1000,
        invert: false
    });

    // Feux par défaut au lancement
    ledVerteH.on();
    ledRougeV.on();

    board.repl.inject({
        button: button,
        piezo: buzzer
    });

    // Quand on appuie sur le bouton
    button.on("up", function() {
        toggle();
    });

    // A la fermeture du projet, on shutdown tout les composants
    board.on('exit', function() {
        ledVerteH.stop();
        ledOrangeH.stop();
        ledRougeH.stop();

        ledVerteV.stop();
        ledOrangeV.stop();
        ledRougeV.stop();

        ledVerteH.off();
        ledOrangeH.off();
        ledRougeH.off();

        ledVerteV.off();
        ledOrangeV.off();
        ledRougeV.off();

        buzzer.off();
    });

    function toggle() {
        if (status === false) {
            status = true;
            ledVerteV.stop();
            ledVerteV.off();

            setTimeout(() => {
                ledRougeV.on();
            }, 2000);

            setTimeout(() => {
                ledRougeH.stop();
                ledRougeH.off();
            }, 3000);

            setTimeout(() => {
                ledVerteH.on();
            }, 4000);

            setTimeout(() => {
                buzzer.frequency(999, 500);
            }, 5000);

            setTimeout(() => {
                buzzer.off();
            }, 5500);
        } else {
            status = false;
            ledVerteH.stop();
            ledVerteH.off();
            setTimeout(() => {
                ledOrangeH.on();
            }, 1000);

            setTimeout(() => {
                ledOrangeH.off();
            }, 3500);

            setTimeout(() => {
                ledRougeH.on();
            }, 4500);

            setTimeout(() => {
                ledRougeV.stop();
                ledRougeV.off();
            }, 5500);

            setTimeout(() => {
                ledVerteV.on();
            }, 6500);

            setTimeout(() => {
                buzzer.frequency(999, 500);
            }, 7500);

            setTimeout(() => {
                buzzer.off();
            }, 8000);
        }
    }
});

webSocketServer.on('connection', (ws) => {
    console.log("Client has connected !");

    ws.onmessage = (event) => {
        let msg = JSON.parse(event.data);

        let circulation = new Circulation({
            nbFeux: msg.nbFeux,
            nbVoituresHorizontales: msg.nbVoituresHorizontales,
            nbVoituresVerticales: msg.nbVoituresVerticales,
            tempsArretHorizontal: msg.tempsArretHorizontal,
            tempsArretVertical: msg.tempsArretVertical
        });

        circulation.save(function (err) {
            if (err)
                console.error(err);
        });

        webSocketServer.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN)
                client.send(event.data);
        });
    }

    ws.on("close", () =>  {
        console.log("Client has disconnected !");
        ws.close();
    });
});

http.listen(PORT, HOST, () => {
    console.log(`Server launched on http://${HOST}:${PORT}`);
});