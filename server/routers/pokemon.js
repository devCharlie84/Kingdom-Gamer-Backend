const express = require("express");
const PokemonController = require("../controllers/pokemon");

const middleware_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post(
  "/add-pokemon",
  [middleware_auth.ensureAuth],
  PokemonController.addPokemon
);

api.get("/get-pokemones", PokemonController.getPokemones);

api.delete(
  "/delete-pokemon/:id",
  [middleware_auth.ensureAuth],
  PokemonController.deletePokemon
);

api.put(
  "/update-pokemon/:id",
  [middleware_auth.ensureAuth],
  PokemonController.updatePokemon
);

module.exports = api;
