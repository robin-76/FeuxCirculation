const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Circulation = new Schema({
  nbFeux: {
    type: Number,
    required: true,
  },
  nbVoituresHorizontales: {
    type: Number,
    required: true,
  },
  nbVoituresVerticales: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("Circulation", Circulation, "Circulation");