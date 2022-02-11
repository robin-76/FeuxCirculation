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
let feuVertHorizontal = true;
let alternanceFeu = false;

board.on('ready', function() {
    app.post('/', () => {
        toggle();
    })

    // Représente un feu horizontal
    const ledVerteH = new five.Led(8);
    const ledOrangeH = new five.Led(9);
    const ledRougeH = new five.Led(10);

    // Représente un feu vertical
    const ledRougeV = new five.Led(11);
    const ledOrangeV = new five.Led(12);
    const ledVerteV = new five.Led(13);

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
        alternanceFeu = true;
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
        if (feuVertHorizontal === false) {
            feuVertHorizontal = true;
            ledVerteV.stop();
            ledVerteV.off();

            ledOrangeV.on();

            setTimeout(() => {
                ledOrangeV.off();
                ledRougeV.on();
            }, 2000);

            setTimeout(() => {
                ledRougeH.stop();
                ledRougeH.off();
                ledVerteH.on();
            }, 3500);

            setTimeout(() => {
                buzzer.frequency(999, 500);
            }, 4500);

            setTimeout(() => {
                buzzer.off();
            }, 5000);
        } else {
            feuVertHorizontal = false;
            ledVerteH.stop();
            ledVerteH.off();

            ledOrangeH.on();

            setTimeout(() => {
                ledOrangeH.off();
                ledRougeH.on();
            }, 2000);

            setTimeout(() => {
                ledRougeV.stop();
                ledRougeV.off();
                ledVerteV.on();
            }, 3500);

            setTimeout(() => {
                buzzer.frequency(999, 500);
            }, 4500);

            setTimeout(() => {
                buzzer.off();
            }, 5000);
        }
    }
});

webSocketServer.on('connection', (ws) => {
    console.log("Client has connected !");

    ws.onmessage = (event) => {
        let msg = JSON.parse(event.data);

        if(alternanceFeu) {
            msg.alternanceFeu = alternanceFeu;
            alternanceFeu = false;
        }
            
        msg.feuVertHorizontal = feuVertHorizontal;
        msg.feuVertVertical = !feuVertHorizontal;

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
                client.send(JSON.stringify(msg));
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

module.exports = app;