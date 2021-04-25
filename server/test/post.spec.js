const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../testIndex");

const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised).should();

chai.use(chaiHttp);

const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYwMzcxNzJkMWQxMDcxNGQ4NDIwMjFkNSIsIm5hbWUiOiJDYXJsb3MiLCJsYXN0bmFtZSI6Ik1vcmFsZXMiLCJlbWFpbCI6ImNhbW9yYWxlc2xAY29ycmVvLnVybC5lZHUuZ3QiLCJyb2xlIjoiYWRtaW4iLCJjcmVhdGVUb2tlbiI6MTYxOTA1ODAwNiwiZXhwaXJhdGlvbiI6MTYyMTY1MDAwNn0.SqAnF-v7C7OHAW8kCrXq-uzubR3Yv7d-V2bD5CUGbLk";

// Unit Testing for PostController
describe("KingdomGamer Posts API ", () => {
  //  Test Get Posts
  describe("GET /api/v1/get-post", () => {
    it("It should GET All the Posts", (done) => {
      chai
        .request(server)
        .get("/api/v1/get-posts")
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("posts");
          done();
        });
    });
  });
  // Test Post Post
  var postIDtoDelete;
  describe("POST /api/v1/add-post", () => {
    it("It should POST a Post", (done) => {
      body = {
        url: "testing-is-boring",
        date: "2021-04-09T06:00:00.000Z",
        title: "Testing-¿Qué es?",
        description: "<h2>Mocha but the coffee?</h2>",
      };
      chai
        .request(server)
        .post("/api/v1/add-post")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          postIDtoDelete = response.body.post._id;
          response.body.should.be.a("object");
          response.body.should.have.property("post");
          response.body.post.url.should.be.eq(body.url);
          response.body.message.should.be.eq("Post creado.");
          done();
        });
    });
    it("It shouldn´t POST a Post because the Post already exist", (done) => {
      body = {
        url: "testing-is-boring",
        date: "2021-04-09T06:00:00.000Z",
        title: "Testing-¿Qué es?",
        description: "<h2>Mocha but the coffee?</h2>",
      };
      chai
        .request(server)
        .post("/api/v1/add-post")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(500);
          response.body.message.should.be.eq("Error del servidor.");
          done();
        });
    });
    it("It shouldn´t Post a Post because there is no Authorization token", (done) => {
      body = {
        url: "testing-is-boring",
        date: "2021-04-09T06:00:00.000Z",
        title: "Testing-¿Qué es?",
        description: "<h2>Mocha but the coffee?</h2>",
      };
      chai
        .request(server)
        .post("/api/v1/add-post")
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
  // Test Update Post
  describe("PUT /api/v1/update-post/:id", () => {
    it("It should Update a Post with a PostID", (done) => {
      body = {
        title: "Testing-Ya se que es",
      };
      chai
        .request(server)
        .put("/api/v1/update-post/" + postIDtoDelete)
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.message.should.be.eq("Post actualizado.");
          done();
        });
    });
    it("It shouldn´t Update a Post because the is no Authorization token", (done) => {
      body = {
        title: "Testing-Ya se que es",
      };
      chai
        .request(server)
        .put("/api/v1/update-post/" + postIDtoDelete)
        .send(body)
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
    it("It shouldn´t Update because the PostID doesnt exist", (done) => {
      body = {
        title: "Testing-Ya se que es",
      };
      chai
        .request(server)
        .put("/api/v1/update-post/6070eab0e6315d423f149229")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(404);
          response.body.message.should.be.eq(
            "No se ha encontrado ningun Post."
          );
          done();
        });
    });
  });
  // Test Delete Post
  describe("DELETE /api/v1/delete-post/:id", () => {
    it("It shouldn´t Delete a Post because there is no Authorization token", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-post/:" + postIDtoDelete)
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
    it("It should Delete a Post ", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-post/" + postIDtoDelete)
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.message.should.be.eq("Post eliminado.");
          done();
        });
    });
    it("It shouldn´t Delete a Post because the Post doesn´t exist ", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-post/" + postIDtoDelete)
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(404);
          response.body.message.should.be.eq("Post no encontrado.");
          done();
        });
    });
  });
});
