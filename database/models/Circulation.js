const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Circulation = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
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
  },
  tempsArretHorizontal: {
    type: Number,
    required: true,
  },
  tempsArretVertical: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("Circulation", Circulation, "Circulation");