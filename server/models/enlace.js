const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnlaceSchema = Schema({
  title: String,
  url: {
    type: String,
    unique: true,
  },
  order: Number,
  active: Boolean,
});

module.exports = mongoose.model("Enlace", EnlaceSchema);
