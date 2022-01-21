const express = require('express');
const app = express();
app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
  res.send('Hello !');
});

app.listen(3000, function () {
  console.log("Express is running on port 3000 !");
});