const mongoose = require('mongoose');

const URL = 'URL_MONGO' in process.env ? process.env.URL_MONGO : "mongodb://localhost";

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });

const connection  = mongoose.connection;

connection.once("open", () => {
    console.log('MongoDB connection estabished successfully')
})

connection.on('error', (err) => {
    console.log("MongoDB Error: " + err)
})

module.exports = connection;