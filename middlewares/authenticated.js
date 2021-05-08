const jwt = require("../services/jwt");
const moment = require("moment");

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La petición no tiene cabecera de Autenticación." });
  }
  const token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decodedToken(token);
    if (payload.expiration <= moment.unix()) {
      return res.status(404).send({ message: "´Su sesión ha expirado." });
    }
  } catch (ex) {
    // console.log(ex);
    return res
      .status(500)
      .send({ message: "Su sesión ha expirado, reinicie su sesión." });
  }

  req.user = payload;
  next();
};
