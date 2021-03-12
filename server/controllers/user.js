const bcrypt = require("bcrypt-nodejs");

const Users = [];

// const User = {
//   id: null,
//   name: "",
//   lastname: "",
//   email: "",
//   password: "",
//   role: "",
//   active: false,
// };

function signUp(req, res) {
  const User = {};
  const { name, lastname, email, password, repeatPassword, role } = req.body;

  if (!name || !lastname || !email || !role) {
    res
      .status(404)
      .send({ code: 404, message: "Todos los campos son obligatorios." });
  } else {
    if (!password || !repeatPassword) {
      res.status(404).send({
        code: 404,
        message: "Las contraseñas son campos obligatorios.",
      });
    } else {
      if (password !== repeatPassword) {
        res
          .status(404)
          .send({ code: 404, message: "Las contraseñas son distintas." });
      } else {
        bcrypt.hash(password, null, null, function (error, hash) {
          if (error) {
            res.status(500).send({
              code: 500,
              message: "Error al encriptar la contraseña.",
            });
          } else {
            User.id = Users.length + 1;
            User.name = name;
            User.lastname = lastname;
            User.email = email.toLowerCase();
            User.role = role;
            User.active = false;

            User.password = hash;

            res.status(201).send({ code: 201, User: User });
            Users.push(User);
          }
        });
      }
    }
  }
}

function getUsers(req, res) {
  if (Users.length === 0) {
    res
      .status(404)
      .send({ code: 404, message: "No se ha encontrado ningún Usuario" });
  } else {
    // const Elements = [];
    // Users.forEach((element) => {
    //   Elements.push(element);
    // });
    res.status(200).send({ code: 200, Users });
  }
}

function getUser(req, res) {
  const { id } = req.params;
  let user = Users.find((user) => user.id == id);

  if (!user) {
    res
      .status(404)
      .send({ code: 404, message: "No se encontro ningún Usuario" });
  } else {
    res.status(200).send({ code: 200, user });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  let userData = req.body;

  if (userData.password) {
    await bcrypt.hash(userData.password, null, null, (error, hash) => {
      if (error) {
        res.status(500).send({ message: "Error al encriptar la contraseña." });
      } else {
        userData.password = hash;
      }
    });
  }

  let user = Users.find((user) => user.id == id);

  if (!user) {
    res
      .status(404)
      .send({ code: 404, message: "No se encontro ningún Usuario" });
  } else {
    if (
      !userData.name ||
      !userData.lastname ||
      !userData.email ||
      !userData.role
    ) {
      res
        .status(404)
        .send({ code: 404, message: "Todos los campos son obligatorios" });
    } else {
      const index = Users.indexOf(user);
      Users[index].name = userData.name;
      Users[index].lastname = userData.lastname;
      Users[index].email = userData.email;
      Users[index].role = userData.role;
      Users[index].password = userData.password;
      res.status(204).send({
        code: 204,
        message: `Se ha actualizado el usuario ${user.name}`,
      });
    }
  }
}

function deleteUser(req, res) {
  const { id } = req.params;
  let user = Users.find((user) => user.id == id);

  if (!user) {
    res
      .status(404)
      .send({ code: 404, message: "No se encontro ningún Usuario" });
  } else {
    const index = Users.indexOf(user);
    Users.splice(index, 1);
    res
      .status(204)
      .send({ code: 204, message: `Se ha eliminado el usuario ${user.name}` });
  }
}

function activateUser(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  let user = Users.find((user) => user.id == id);

  if (!user) {
    res
      .status(404)
      .send({ code: 404, message: "No se encontro ningún Usuario" });
  } else {
    const index = Users.indexOf(user);
    if (active === true) {
      console.log(Users[index]);
      Users[index].active = active;
      res.status(200).send({ code: 200, message: "Usuario Activado" });
    }
    if (active === false) {
      Users[index].active = active;
      res.status(200).send({ code: 200, message: "Usuario Desactivado" });
    }
  }
}

module.exports = {
  signUp,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  activateUser,
};
