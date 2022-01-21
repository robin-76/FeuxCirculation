const express = require('express');
const arduino = require('./arduino');
const app = express();
app.use(express.static(__dirname + "/public"));

const port = 3000;

// Led 13 blink
arduino.blink();

app.get('/', function (req, res) {
  return res.send('Working');
});

app.listen(3000, function () {
    console.log('Express is running on port http://0.0.0.0:' + port + '!');
});