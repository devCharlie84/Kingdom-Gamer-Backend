const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const Mailer = require("../templates/newsletter-template");

function signUp(req, res) {
  const user = new User();

  const { name, lastname, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = "admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res
      .status(404)
      .send({ message: "Las contraseñas son campos obligatorios." });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Las contraseñas deben ser iguales." });
    } else {
      bcrypt.hash(password, null, null, function (err, hash) {
        if (err) {
          res
            .status(500)
            .send({ message: "Error al encriptar la contraseña." });
        } else {
          user.password = hash;

          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({
                message: "Cuenta ya asociada con este correo electrónico.",
              });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Error al crear Usuario." });
              } else {
                res.status(200).send({ user: userStored });
                Mailer.sendEmailRegister(
                  userStored.name,
                  userStored.lastname,
                  userStored.email
                );
              }
            }
          });
        }
      });
    }
  }
}

function signIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (error, userStored) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userStored) {
        res.status(404).send({
          message: "Correo electrónico/contraseña incorrectos.",
        });
      } else {
        bcrypt.compare(password, userStored.password, (error, success) => {
          if (error) {
            res.status(500).send({ message: "Error del servidor." });
          } else if (!success) {
            res
              .status(404)
              .send({ message: "Correo electrónico/contraseña incorrectos." });
          } else {
            if (!userStored.active) {
              res.status(200).send({
                code: 200,
                message:
                  "El usuario no está activo. Consulte con un administrador para su activación.",
              });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
}

function getUsers(req, res) {
  User.find().then((users) => {
    if (!users) {
      res.status(404).send({ message: "No se ha encontrado ningún Usuario" });
    } else {
      res.status(200).send({ users });
    }
  });
}

function getUsersActive(req, res) {
  const query = req.query;

  User.find({ active: query.active }).then((users) => {
    if (!users) {
      res.status(404).send({ message: "No se ha encontrado ningún Usuario" });
    } else {
      res.status(200).send({ users });
    }
  });
}

function uploadAvatar(req, res) {
  const params = req.params;

  User.findById({ _id: params.id }, (error, userData) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userData) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        let user = userData;

        if (req.files) {
          let filePath = req.files.avatar.path;
          let fileName = filePath.replace(/^.*[\\\/]/, "");
          // let fileSplit = filePath.split("/");
          // let fileName = fileSplit[2];
          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];

          if (fileExt !== "png" && fileExt !== "jpg") {
            res.status(400).send({
              message:
                "La extensión de la imágen no es válida. (JPG/PNG únicamente)",
            });
          } else {
            user.avatar = fileName;
            User.findByIdAndUpdate(
              { _id: params.id },
              user,
              (error, userResult) => {
                if (error) {
                  res.status(500).send({ message: "Error del servidor." });
                } else {
                  if (!userResult) {
                    res.status(404).send({ message: "Usuario no encontrado." });
                  } else {
                    res.status(200).send({ avatarName: fileName });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar/" + avatarName;

  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.status(404).send({ message: "El Avatar no existe." });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

async function updateUser(req, res) {
  let userData = req.body;
  userData.email = req.body.email.toLowerCase();
  const params = req.params;

  if (userData.password) {
    await bcrypt.hash(userData.password, null, null, (error, hash) => {
      if (error) {
        res.status(500).send({ message: "Error al encriptar la contraseña." });
      } else {
        userData.password = hash;
      }
    });
  }

  User.findByIdAndUpdate({ _id: params.id }, userData, (error, userUpdate) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userUpdate) {
        res
          .status(404)
          .send({ message: "No se ha encontrado ningún Usuario." });
      } else {
        res.status(200).send({ message: "Usuario actualizado." });
      }
    }
  });
}

function activateUser(req, res) {
  const { id } = req.params;
  const { active } = req.body;
  // User.findByIdAndUpdate(id, {active: active})
  User.findByIdAndUpdate(id, { active }, (error, userStorage) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userStorage) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        if (active === true) {
          res.status(200).send({ message: "Usuario Activado." });
        } else {
          res.status(200).send({ message: "Usuario Desactivado." });
        }
      }
    }
  });
}

function deleteUser(req, res) {
  const params = req.params;

  User.findByIdAndRemove({ _id: params.id }, (error, userDeleted) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userDeleted) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        res.status(200).send({ message: "Usuario eliminado." });
      }
    }
  });
}

function signUpAdmin(req, res) {
  const user = new User();

  const { name, lastname, email, role, password } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = role;
  user.active = true;

  if (!password) {
    res.status(500).send({ message: "La contraseña es obligatoria." });
  } else {
    bcrypt.hash(password, null, null, (error, hash) => {
      if (error) {
        res.status(500).send({ message: "Error al encriptar la contraseña." });
      } else {
        user.password = hash;

        user.save((error, userStored) => {
          if (error) {
            res.status(500).send({ message: "Usuario ya existente." });
          } else {
            if (!userStored) {
              res.status(500).send({ message: "Error al crear Usuario." });
            } else {
              res
                .status(200)
                .send({ user: userStored, message: "Usuario creado." });
            }
          }
        });
      }
    });
  }
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser,
  activateUser,
  deleteUser,
  signUpAdmin,
};
