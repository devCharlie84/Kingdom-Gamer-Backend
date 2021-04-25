const chai = require("chai");
const chaiHttp = require("chai-http");
const mocha = require("mocha");
const sinon = require("sinon");
const server = require("../index");

const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised).should();

chai.use(chaiHttp);

const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYwMzcxNzJkMWQxMDcxNGQ4NDIwMjFkNSIsIm5hbWUiOiJDYXJsb3MiLCJsYXN0bmFtZSI6Ik1vcmFsZXMiLCJlbWFpbCI6ImNhbW9yYWxlc2xAY29ycmVvLnVybC5lZHUuZ3QiLCJyb2xlIjoiYWRtaW4iLCJjcmVhdGVUb2tlbiI6MTYxOTA1ODAwNiwiZXhwaXJhdGlvbiI6MTYyMTY1MDAwNn0.SqAnF-v7C7OHAW8kCrXq-uzubR3Yv7d-V2bD5CUGbLk";

// Unit Testing for EnlaceController
describe("KingdomGamer Enlaces API ", () => {
  //  Test Get Enlaces
  describe("GET /api/v1/get-enlace", () => {
    it("It should GET All the Enlaces", (done) => {
      chai
        .request(server)
        .get("/api/v1/get-enlaces")
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("enlace");
          done();
        });
    });
  });
  // Test Post Enlace
  var enlaceIDtoDelete;
  describe("POST /api/v1/add-enlace", () => {
    it("It should POST a Enlace", (done) => {
      body = {
        title: "Pokedex",
        url: "/pokedex",
        order: 1,
        active: true,
      };
      chai
        .request(server)
        .post("/api/v1/add-enlace")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          enlaceIDtoDelete = response.body.enlace._id;
          response.body.should.be.a("object");
          response.body.should.have.property("enlace");
          response.body.enlace.title.should.be.eq(body.title);
          response.body.message.should.be.eq("Enlace creado.");
          done();
        });
    });
    it("It shouldn´t POST a Enlace because the Enlace already exist", (done) => {
      body = {
        title: "Pokedex",
        url: "/pokedex",
        order: 1,
        active: true,
      };
      chai
        .request(server)
        .post("/api/v1/add-enlace")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(500);
          response.text.should.be.eq('{"message":"Error del servidor."}');
          done();
        });
    });
    it("It shouldn´t Post a Enlace because there is no Authorization token", (done) => {
      body = {
        title: "Pokedex",
        url: "/pokedex",
        order: 1,
        active: true,
      };
      chai
        .request(server)
        .post("/api/v1/add-enlace")
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
  // Test Update Enlace
  describe("PUT /api/v1/update-enlace/:id", () => {
    it("It should Update a Enlace with a EnlaceID", (done) => {
      body = {
        title: "Pokemania",
      };
      chai
        .request(server)
        .put("/api/v1/update-enlace/" + enlaceIDtoDelete)
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.text.should.be.eq('{"message":"Enlace actualizado."}');
          done();
        });
    });
    it("It shouldn´t Update a Enlace because the is no Authorization token", (done) => {
      body = {
        title: "PokemaniaV2",
      };
      chai
        .request(server)
        .put("/api/v1/update-enlace/" + enlaceIDtoDelete)
        .send(body)
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
    it("It shouldn´t Update because the EnlaceID doesnt exist", (done) => {
      body = {
        title: "PokemaniaV3",
      };
      chai
        .request(server)
        .put("/api/v1/update-enlace/606b895f684ad869081277e8")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            '{"message":"No se ha encontrado ningún Enlace."}'
          );
          done();
        });
    });
  });
  // Test Update Activate/Inactivate Enlace
  describe("PUT /api/v1/update-enlace/:id", () => {
    it("It should Activate a Enlace with a EnlaceID", (done) => {
      body = {
        active: true,
      };
      chai
        .request(server)
        .put("/api/v1/activate-enlace/" + enlaceIDtoDelete)
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.text.should.be.eq('{"message":"Enlace activado."}');
          done();
        });
    });
    it("It should Inactivate a Enlace with a EnlaceID", (done) => {
      body = {
        active: false,
      };
      chai
        .request(server)
        .put("/api/v1/activate-enlace/" + enlaceIDtoDelete)
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.text.should.be.eq('{"message":"Enlace desactivado."}');
          done();
        });
    });
    it("It shouldn´t Activate/Inactivate a Enlace because the EnlaceID doesn´t exist", (done) => {
      body = {
        active: false,
      };
      chai
        .request(server)
        .put("/api/v1/activate-enlace/606b895f684ad869081277e8")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            '{"message":"No se ha encontrado ningún Enlace."}'
          );
          done();
        });
    });
    it("It shouldn´t Activate/Inactivate a User with a EnlaceID because there is no authentication token", (done) => {
      body = {
        active: true,
      };
      chai
        .request(server)
        .put("/api/v1/activate-enlace/" + enlaceIDtoDelete)
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
  // Test Delete Enlace
  describe("DELETE /api/v1/delete-enlace/:id", () => {
    it("It shouldn´t Delete a Enlace because there is no Authorization token", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-enlace/:" + enlaceIDtoDelete)
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
    it("It should Delete a Enlace ", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-enlace/" + enlaceIDtoDelete)
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(200);
          response.text.should.be.eq('{"message":"Enlace eliminado."}');
          done();
        });
    });
    it("It shouldn´t Delete a Enlace because the Enlace doesn´t exist ", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-enlace/" + enlaceIDtoDelete)
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(404);
          response.text.should.be.eq('{"message":"Enlace no encontrado."}');
          done();
        });
    });
  });
});
