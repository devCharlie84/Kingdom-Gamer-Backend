const express = require("express");
const UserController = require("../controllers/user");
const multiparty = require("connect-multiparty");

const middleware_auth = require("../middlewares/authenticated");
const middleware_upload_avatar = multiparty({ uploadDir: "./uploads/avatar" });

const api = express.Router();

api.post("/sign-up", UserController.signUp);

api.post("/sign-in", UserController.signIn);

api.post(
  "/sign-up-admin",
  [middleware_auth.ensureAuth],
  UserController.signUpAdmin
);

api.post("/sign-up-super-admin", UserController.signUpAdmin);

api.get("/users", [middleware_auth.ensureAuth], UserController.getUsers);

api.get(
  "/users-active",
  [middleware_auth.ensureAuth],
  UserController.getUsersActive
);

api.get("/users-first-time", UserController.getUsers);

api.get("/get-avatar/:avatarName", UserController.getAvatar);

api.put(
  "/upload-avatar/:id",
  [middleware_auth.ensureAuth, middleware_upload_avatar],
  UserController.uploadAvatar
);

api.put(
  "/update-user/:id",
  [middleware_auth.ensureAuth],
  UserController.updateUser
);

api.put(
  "/activate-user/:id",
  [middleware_auth.ensureAuth],
  UserController.activateUser
);

api.delete(
  "/delete-user/:id",
  [middleware_auth.ensureAuth],
  UserController.deleteUser
);

module.exports = api;
