const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../testIndex");

const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised).should();

chai.use(chaiHttp);

const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYwMzcxNzJkMWQxMDcxNGQ4NDIwMjFkNSIsIm5hbWUiOiJDYXJsb3MiLCJsYXN0bmFtZSI6Ik1vcmFsZXMiLCJlbWFpbCI6ImNhbW9yYWxlc2xAY29ycmVvLnVybC5lZHUuZ3QiLCJyb2xlIjoiYWRtaW4iLCJjcmVhdGVUb2tlbiI6MTYxOTA1ODAwNiwiZXhwaXJhdGlvbiI6MTYyMTY1MDAwNn0.SqAnF-v7C7OHAW8kCrXq-uzubR3Yv7d-V2bD5CUGbLk";

// Unit Testing for PokemonController
describe("KingdomGamer Enlaces API ", () => {
  //  Test Get Pokemones
  describe("GET /api/v1/get-pokemones", () => {
    it("It should GET All the Pokemones", (done) => {
      chai
        .request(server)
        .get("/api/v1/get-pokemones")
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("pokemones");
          done();
        });
    });
  });
  // Test Post Pokemon
  var pokemonIDtoDelete;
  describe("POST /api/v1/add-pokemon", () => {
    it("It should POST a Pokemon", (done) => {
      body = {
        idPokemon: "898",
      };
      chai
        .request(server)
        .post("/api/v1/add-pokemon")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          pokemonIDtoDelete = response.body.pokemon._id;
          response.body.should.be.a("object");
          response.body.should.have.property("pokemon");
          response.body.pokemon.idPokemon.should.be.eq(body.idPokemon);
          response.body.message.should.be.eq("Pokemon creado.");
          done();
        });
    });
    it("It shouldn´t POST a Pokemon because the Pokemon already exist", (done) => {
      body = {
        idPokemon: 898,
      };
      chai
        .request(server)
        .post("/api/v1/add-pokemon")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(400);
          response.body.message.should.be.eq("El Pokemon ya existe.");
          done();
        });
    });
    it("It shouldn´t Post a Pokemon because there is no Authorization token", (done) => {
      body = {
        idPokemon: 898,
      };
      chai
        .request(server)
        .post("/api/v1/add-pokemon")
        .send(body)
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
  });
  // Test Update Pokemon
  describe("PUT /api/v1/update-pokemon/:id", () => {
    it("It should Update a Pokemon with a PokemonID", (done) => {
      body = {
        apodo: "MiPoke",
      };
      chai
        .request(server)
        .put("/api/v1/update-pokemon/" + pokemonIDtoDelete)
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.message.should.be.eq("Pokemon actualizado.");
          done();
        });
    });
    it("It shouldn´t Update a Pokemon because the is no Authorization token", (done) => {
      body = {
        apodo: "MiPoke",
      };
      chai
        .request(server)
        .put("/api/v1/update-pokemon/" + pokemonIDtoDelete)
        .send(body)
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
    it("It shouldn´t Update because the PokemonID doesnt exist", (done) => {
      body = {
        apodo: "MiPoke",
      };
      chai
        .request(server)
        .put("/api/v1/update-pokemon/607e6d658297ec466c57f777")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(404);
          response.body.message.should.be.eq(
            "No se ha encontrado ningun Pokemon."
          );
          done();
        });
    });
  });
  //   // Test Delete Pokemon
  describe("DELETE /api/v1/delete-pokemon/:id", () => {
    it("It shouldn´t Delete a Pokemon because there is no Authorization token", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-pokemon/:" + pokemonIDtoDelete)
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
    it("It should Delete a Pokemon ", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-pokemon/" + pokemonIDtoDelete)
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.message.should.be.eq("Pokemon eliminado.");
          done();
        });
    });
    it("It shouldn´t Delete a Pokemon because the Pokemon doesn´t exist ", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-pokemon/" + pokemonIDtoDelete)
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(404);
          response.body.message.should.be.eq("Pokemon no encontrado.");
          done();
        });
    });
  });
});
