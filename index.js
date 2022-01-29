const express = require('express');
const db = require('./database/db');
const Feu = require('./database/models/Feu');
const Circulation = require('./database/models/Circulation');
Circulation.collection.drop();
const arduino = require('./arduino');
const app = express();
app.use(express.static(__dirname + "/public"));

const WebSocket = require('ws');
const http = require('http').Server(app);
const webSocketServer = new WebSocket.Server({ server: http });

const HOST = '0.0.0.0';
const PORT = 3000;

webSocketServer.on('connection', (ws) => {
    console.log("New client connected !");

    ws.onmessage = (event) => {
        var msg = JSON.parse(event.data);
        console.log("nb feux : " + msg.nbFeux);
        console.log("Feu Horizontal ? " + msg.feuVertHorizontal);
        console.log("Feu Vertical ? " + msg.feuVertVertical);

        Feu.collection.drop();
        let feu = new Feu({
            feuVertHorizontal : msg.feuVertHorizontal,
            feuVertVertical : msg.feuVertVertical,
            nbFeux : msg.nbFeux
        });
        
        feu.save(function (err) {
            if (err)
                console.error(err);
        });

        let circulation = new Circulation({
            nbVoituresHorizontales : msg.nbVoituresHorizontales,
            nbVoituresVerticales : msg.nbVoituresVerticales
        });
        
        circulation.save(function (err) {
            if (err)
                console.error(err);
        });
    }

    ws.on("close", () =>  {
        console.log("Client has disconnected !");
    });
});    

// Led 13 blink
arduino.blink();

http.listen(PORT, HOST, () => {
    console.log(`Server launched on http://${HOST}:${PORT}`);
});
