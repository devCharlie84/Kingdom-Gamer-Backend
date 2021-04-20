const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const PokemonSchema = Schema({
  idPokemon: {
    type: String,
    unique: true,
    required: true,
  },
  apodo: String,
  default_image: String,
  shiny_image: String,
  height: Number,
  weight: Number,
  type: String,
  base_experience: Number,
  order: Number,
});

PokemonSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Pokemon", PokemonSchema);
