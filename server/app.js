const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const { API_VERSION } = require("./config");

const app = express();

//Carga de Rutas
const authRoutes = require("./routers/auth");
const userRoutes = require("./routers/user");
const postRoutes = require("./routers/post");
const enlaceRoutes = require("./routers/enlace");
const newsletterRoutes = require("./routers/newsletter");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de Header HTTP
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Router
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, postRoutes);
app.use(`/api/${API_VERSION}`, enlaceRoutes);
app.use(`/api/${API_VERSION}`, newsletterRoutes);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  const status = err.status || 500;
  res.status(status);
  res.json({
    status,
    message: err.message,
  });
});

module.exports = app;
