const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../testIndex");
chai.should();

chai.use(chaiHttp);

const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYwMzcxNzJkMWQxMDcxNGQ4NDIwMjFkNSIsIm5hbWUiOiJDYXJsb3MiLCJsYXN0bmFtZSI6Ik1vcmFsZXMiLCJlbWFpbCI6ImNhbW9yYWxlc2xAY29ycmVvLnVybC5lZHUuZ3QiLCJyb2xlIjoiYWRtaW4iLCJjcmVhdGVUb2tlbiI6MTYxOTA1ODAwNiwiZXhwaXJhdGlvbiI6MTYyMTY1MDAwNn0.SqAnF-v7C7OHAW8kCrXq-uzubR3Yv7d-V2bD5CUGbLk";

// Unit Testing for UserController
describe("KingdomGamer Users API ", () => {
  // Test the GET Request for Users
  describe("GET /api/v1/users", () => {
    it("It should GET all the Users", (done) => {
      chai
        .request(server)
        .get("/api/v1/users")
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("users");
          response.body.users[0].should.have.property("_id");
          response.body.users[0].should.have.property("lastname");
          response.body.users[0].should.have.property("email");
          response.body.users[0].should.have.property("active");
          response.body.users[0].should.have.property("password");
          response.body.users[0].should.have.property("avatar");
          done();
        });
    });
    it("It shouldn´t GET the users because there isn´t an Authorization token", (done) => {
      chai
        .request(server)
        .get("/api/v1/users")
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
  });

  // // Test Get Users Active
  describe("GET /api/v1/users-active Active=True", () => {
    it("It should GET Users Active", (done) => {
      chai
        .request(server)
        .get("/api/v1/users-active?active=true")
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("users");
          done();
        });
    });
    it("It shouldn´t GET the Users Active because there isn´t an Authorization token", (done) => {
      chai
        .request(server)
        .get("/api/v1/users")
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
  });

  // // Test Get Users Inactive
  describe("GET /api/v1/users-active Active=False", () => {
    it("It should GET Users Inactive", (done) => {
      chai
        .request(server)
        .get("/api/v1/users-active?active=false")
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("users");
          done();
        });
    });
    it("It shouldn´t GET the Users Inactive because there isn´t an Authorization token", (done) => {
      chai
        .request(server)
        .get("/api/v1/users-active?active=false")
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
  });

  // Test Post SingUp
  var userIDtoDelete;
  describe("POST /api/v1/sign-up", () => {
    it("It should POST a User", (done) => {
      body = {
        name: "Andrés",
        lastname: "Lara",
        email: "camoralesl1997@gmail.com",
        role: "poketrainer",
        active: true,
        password: "passwordTest123#",
        repeatPassword: "passwordTest123#",
      };
      chai
        .request(server)
        .post("/api/v1/sign-up")
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          userIDtoDelete = response.body.user._id;
          response.body.should.be.a("object");
          response.body.should.have.property("user");
          response.body.user.email.should.be.eq(body.email);
          done();
        });
    });
    it("It shouldn´t POST a User because the user already exist", (done) => {
      body = {
        name: "Andrés",
        lastname: "Lara",
        email: "camoralesl1997@gmail.com",
        role: "poketrainer",
        active: true,
        password: "passwordTest123#",
        repeatPassword: "passwordTest123#",
      };
      chai
        .request(server)
        .post("/api/v1/sign-up")
        .send(body)
        .end((error, response) => {
          response.should.have.status(500);
          response.text.should.be.eq(
            '{"message":"Cuenta ya asociada con este correo electrónico."}'
          );
          done();
        });
    });
    it("It shouldn´t POST a User because the user didn´t provide the two password parameters", (done) => {
      body = {
        name: "Andrés",
        lastname: "Lara",
        email: "camoralesl1997@gmail.com",
        role: "poketrainer",
        active: true,
        password: "passwordTest123#",
      };
      chai
        .request(server)
        .post("/api/v1/sign-up")
        .send(body)
        .end((error, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            '{"message":"Las contraseñas son campos obligatorios."}'
          );
          done();
        });
    });
    it("It shouldn´t POST a User because the password and the repeatPassword are not the same ", (done) => {
      body = {
        name: "Andrés",
        lastname: "Lara",
        email: "camoralesl1997@gmail.com",
        role: "poketrainer",
        active: true,
        password: "passwordTest123#",
        repeatPassword: "IamAdmin123#",
      };
      chai
        .request(server)
        .post("/api/v1/sign-up")
        .send(body)
        .end((error, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            '{"message":"Las contraseñas deben ser iguales."}'
          );
          done();
        });
    });
  });

  // // Test Post SignIn
  describe("POST /api/v1/sign-in", () => {
    it("It should POST the Login", (done) => {
      body = {
        email: "carlosmorales1284@hotmail.com",
        password: "Charlie1284#",
      };
      chai
        .request(server)
        .post("/api/v1/sign-in")
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
          response.body.should.have.property("accessToken");
          response.body.should.have.property("refreshToken");
          done();
        });
    });
    it("It shouldn´t POST the Login because the email is not part of an account ", (done) => {
      body = {
        email: "notmyemail@correo.url.edu.gt",
        password: "camoralesl123#",
      };
      chai
        .request(server)
        .post("/api/v1/sign-in")
        .send(body)
        .end((error, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            '{"message":"Correo electrónico/contraseña incorrectos."}'
          );
          done();
        });
    });
    it("It shouldn´t POST the Login because the password is not correct ", (done) => {
      body = {
        email: "camoralesll@correo.url.edu.gt",
        password: "thisIsWrong123#",
      };
      chai
        .request(server)
        .post("/api/v1/sign-in")
        .send(body)
        .end((error, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            '{"message":"Correo electrónico/contraseña incorrectos."}'
          );
          done();
        });
    });
  });

  // Test Update User
  describe("PUT /api/v1/update-user/:id", () => {
    it("It should Update a User with a UserID", async () => {
      body = {
        name: "Andrea",
        lastname: "Arango",
      };
      chai
        .request(server)
        .put("/api/v1/update-user/" + userIDtoDelete)
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.text.should.be.eq('{"message":"Usuario actualizado."}');
          done();
        });
    });
    it("It shouldn´t Update a User because the is no Authorization token", (done) => {
      body = {
        name: "Andrea",
        lastname: "Arango",
      };
      chai
        .request(server)
        .put("/api/v1/update-user/" + userIDtoDelete)
        .send(body)
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
    it("It shouldn´t Update because the UserID doesnt exist", async () => {
      body = {
        name: "Andrea",
        lastname: "Arango",
      };
      chai
        .request(server)
        .put("/api/v1/update-user/603719ch9wb5c03768b2b2c4")
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            '{"message":"No se ha encontrado ningún Usuario."}'
          );
          done();
        });
    });
  });

  // Test Update Activate/Inactivate User
  describe("PUT /api/v1/activate-user/:id", () => {
    it("It should Activate a User with a UserID", (done) => {
      body = {
        active: true,
      };
      chai
        .request(server)
        .put("/api/v1/activate-user/" + userIDtoDelete)
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.text.should.be.eq('{"message":"Usuario Activado."}');
          done();
        });
    });
    it("It should Inactivate a User with a UserID", (done) => {
      body = {
        active: false,
      };
      chai
        .request(server)
        .put("/api/v1/activate-user/" + userIDtoDelete)
        .set("Authorization", access_token)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.text.should.be.eq('{"message":"Usuario Desactivado."}');
          done();
        });
    });
    it("It shouldn´t Activate/Inactivate a User with a UserID because there isn´t an Authentication token", (done) => {
      body = {
        active: true,
      };
      chai
        .request(server)
        .put("/api/v1/activate-user/" + userIDtoDelete)
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

  // Test Delete User
  describe("DELETE /api/v1/delete-user/:id", () => {
    it("It shouldn´t Delete a User because there is no Authorization token", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-user/" + userIDtoDelete)
        .end((error, response) => {
          response.should.have.status(403);
          response.text.should.be.eq(
            '{"message":"La petición no tiene cabecera de Autenticación."}'
          );
          done();
        });
    });
    it("It should Delete a User", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-user/" + userIDtoDelete)
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(200);
          response.text.should.be.eq('{"message":"Usuario eliminado."}');
          done();
        });
      // .catch((error) => done(error));
    });
    it("It shouldn´t Delete a User because the User to delete doesnt exist", (done) => {
      chai
        .request(server)
        .delete("/api/v1/delete-user/" + userIDtoDelete)
        .set("Authorization", access_token)
        .end((error, response) => {
          response.should.have.status(404);
          response.text.should.be.eq('{"message":"Usuario no encontrado."}');
          done();
        });
    });
  });
});
