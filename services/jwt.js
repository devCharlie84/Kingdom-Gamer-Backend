const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "84CAMLQfHyd0jDllkzliw5iqMHdfY4LVRzySG40FEKgFHEb";

exports.createAccessToken = function (user) {
  const payload = {
    id: user._id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    createToken: moment().unix(),
    expiration: moment().add(1, "hour").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

exports.createRefreshToken = function (user) {
  const payload = {
    id: user._id,
    expiration: moment().add(1, "hour").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

exports.decodedToken = function (token) {
  return jwt.decode(token, SECRET_KEY, true);
};
