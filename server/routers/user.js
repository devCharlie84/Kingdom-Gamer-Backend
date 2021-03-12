const express = require("express");
const UserController = require("../controllers/user");

const api = express.Router();

api.post("/sign-up", UserController.signUp);

api.get("/get-users", UserController.getUsers);

api.get("/get-user/:id", UserController.getUser);

api.put("/update-user/:id", UserController.updateUser);

api.delete("/delete-user/:id", UserController.deleteUser);

api.put("/activate-user/:id", UserController.activateUser);

module.exports = api;
