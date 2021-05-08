const Enlace = require("../models/enlace");

function addEnlace(req, res) {
  const { title, url, order, active } = req.body;
  const enlace = new Enlace();
  enlace.title = title;
  enlace.url = url;
  enlace.order = order;
  enlace.active = active;

  enlace.save((error, createdEnlace) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!createdEnlace) {
        res.status(404).send({ message: "Error al crear el Enlace." });
      } else {
        res
          .status(200)
          .send({ message: "Enlace creado.", enlace: createdEnlace });
      }
    }
  });
}

function getEnlaces(req, res) {
  Enlace.find()
    .sort({ order: "asc" })
    .exec((error, enlaceSorted) => {
      if (error) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!enlaceSorted) {
          res
            .status(404)
            .send({ message: "No se ha encontrado ningún Enlace." });
        } else {
          res.status(200).send({ enlace: enlaceSorted });
        }
      }
    });
}

function updateEnlace(req, res) {
  let enlaceData = req.body;
  const params = req.params;

  Enlace.findByIdAndUpdate(params.id, enlaceData, (error, enlaceUpdate) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!enlaceUpdate) {
        res.status(404).send({ message: "No se ha encontrado ningún Enlace." });
      } else {
        res.status(200).send({ message: "Enlace actualizado." });
      }
    }
  });
}

function activateEnlace(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  Enlace.findByIdAndUpdate(id, { active }, (error, enlaceUpdate) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!enlaceUpdate) {
        res.status(404).send({ message: "No se ha encontrado ningún Enlace." });
      } else {
        if (active === true) {
          res.status(200).send({ message: "Enlace activado." });
        } else {
          res.status(200).send({ message: "Enlace desactivado." });
        }
      }
    }
  });
}

function deleteEnlace(req, res) {
  const { id } = req.params;
  Enlace.findByIdAndRemove(id, (error, enlaceDelete) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!enlaceDelete) {
        res.status(404).send({ message: "Enlace no encontrado." });
      } else {
        res.status(200).send({ message: "Enlace eliminado." });
      }
    }
  });
}

module.exports = {
  addEnlace,
  getEnlaces,
  updateEnlace,
  activateEnlace,
  deleteEnlace,
};
