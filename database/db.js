const mongoose = require('mongoose');

const URL = 'URL_MONGO' in process.env ? process.env.URL_MONGO : "mongodb://localhost";

mongoose.connect(URL, function(err, db) {
    if (err) throw err;
    db.dropDatabase();
});

const connection  = mongoose.connection;

connection.once("open", () => {
    console.log('MongoDB connection estabished successfully')
})

connection.on('error', (err) => {
    console.log("MongoDB Error: " + err)
})

module.exports = connection;