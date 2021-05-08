const { response } = require("express");
const Pokemon = require("../models/pokemon");

function addPokemon(req, res) {
  const body = req.body;
  // if (parseInt(body.idPokemon) > 898 || parseInt(body.idPokemon) < 0) {
  //   res.status(400).send({ code: 400, message: "El Pokemon no existe." });
  // }
  const pokemon = new Pokemon(body);
  pokemon.order = 0;

  pokemon.save((error, pokemonStored) => {
    if (error) {
      res.status(400).send({ code: 400, message: "El Pokemon ya existe." });
    } else {
      if (!pokemonStored) {
        res.status(400).send({
          code: 400,
          message: "No se ha podido crear el Pokemon.",
        });
      } else {
        res.status(200).send({
          code: 200,
          message: "Pokemon creado.",
          pokemon: pokemonStored,
        });
      }
    }
  });
}

// function getPokemonesPaginate(req, res) {
//   const { page = 1, limit = 10 } = req.query;

//   const options = {
//     page: page,
//     limit: parseInt(limit),
//     sort: { order: "asc" },
//   };
//   Pokemon.paginate({}, options, (error, pokemonesStored) => {
//     if (error) {
//       res.status(500).send({ code: 500, message: "Error del servidor." });
//     } else {
//       if (!pokemonesStored) {
//         res
//           .status(404)
//           .send({ code: 404, message: "No se ha encontrado ningun Pokemon." });
//       } else {
//         res.status(200).send({ code: 200, pokemones: pokemonesStored });
//       }
//     }
//   });
// }

function getPokemones(req, res) {
  Pokemon.find()
    .sort({ order: "asc" })
    .exec((error, pokemonesStored) => {
      if (error) {
        res.status(500).send({ code: 500, message: "Error del servidor." });
      } else {
        if (!pokemonesStored) {
          res.status(404).send({
            code: 404,
            message: "No se ha encontrado ningún Pokemon.",
          });
        } else {
          res.status(200).send({ code: 200, pokemones: pokemonesStored });
        }
      }
    });
}

function deletePokemon(req, res) {
  const { id } = req.params;

  Pokemon.findByIdAndRemove(id, (error, pokemonDeleted) => {
    if (error) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!pokemonDeleted) {
        res.status(404).send({ code: 404, message: "Pokemon no encontrado." });
      } else {
        res.status(200).send({
          code: 200,
          message: "Pokemon eliminado.",
        });
      }
    }
  });
}

function updatePokemon(req, res) {
  const pokemonData = req.body;
  const id = req.params.id;

  Pokemon.findByIdAndUpdate(id, pokemonData, (error, pokemonUpdate) => {
    if (error) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!pokemonUpdate) {
        res
          .status(404)
          .send({ code: 404, message: "No se ha encontrado ningun Pokemon." });
      } else {
        res.status(200).send({ code: 200, message: "Pokemon actualizado." });
      }
    }
  });
}

module.exports = {
  addPokemon,
  getPokemones,
  deletePokemon,
  updatePokemon,
};
