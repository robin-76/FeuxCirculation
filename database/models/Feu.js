const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Feu = new Schema({
    feuVertHorizontal: {
        type: Boolean,
        required: true,
    },
    feuVertVertical: {
        type: Boolean,
        required: true,
    },
    nbFeux: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("Feu", Feu, "Feu");