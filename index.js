const express = require('express');
const db = require('./database/db');
const Circulation = require('./database/models/Circulation');
const arduino = require('./arduino');
const app = express();
app.use(express.static(__dirname + "/public"));

const WebSocket = require('ws');
const http = require('http').Server(app);
const webSocketServer = new WebSocket.Server({ server: http });

const HOST = '0.0.0.0';
const PORT = 3000;

webSocketServer.on('connection', (ws) => {
    console.log("Client has connected !");

    ws.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        //console.log(msg)
        //console.log("Alternance Feu ?"+ msg.alternanceFeu);
        //console.log("Feu Horizontal ? " + msg.feuVertHorizontal);
        //console.log("Feu Vertical ? " + msg.feuVertVertical);
        //console.log("nb feux : " + msg.nbFeux);
        //console.log("nb voitHoriz ? " + msg.nbVoituresHorizontales);
        //console.log("nb voitVert ? " + msg.nbVoituresVerticales);
        //console.log("temps arret H " + msg.tempsArretHorizontal);
        //console.log("temps arret V " + msg.tempsArretVertical);

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
    });
});    

// Led 13 blink
arduino.blink();

http.listen(PORT, HOST, () => {
    console.log(`Server launched on http://${HOST}:${PORT}`);
});
