const express = require("express");
const EnlaceController = require("../controllers/enlace");

const middleware_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post(
  "/add-enlace",
  [middleware_auth.ensureAuth],
  EnlaceController.addEnlace
);

api.get("/get-enlaces", EnlaceController.getEnlaces);

api.put(
  "/update-enlace/:id",
  [middleware_auth.ensureAuth],
  EnlaceController.updateEnlace
);

api.put(
  "/activate-enlace/:id",
  [middleware_auth.ensureAuth],
  EnlaceController.activateEnlace
);

api.delete(
  "/delete-enlace/:id",
  [middleware_auth.ensureAuth],
  EnlaceController.deleteEnlace
);

module.exports = api;
