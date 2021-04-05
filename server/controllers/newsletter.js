const Newsletter = require("../models/newsletter");
const Mailer = require("../templates/newsletter-template");

function suscribeEmail(req, res) {
  const email = req.params.email;
  const newsletter = new Newsletter();
  if (!email) {
    res
      .status(404)
      .send({ code: 404, message: "El correo electrónico es obligatorio" });
  } else {
    newsletter.email = email.toLowerCase();
    newsletter.save((err, newsletterStore) => {
      if (err) {
        res.status(500).send({
          code: 500,
          message: "El correo electrónico ya está suscrito al Newsletter.",
        });
      } else {
        if (!newsletterStore) {
          res.status(400).send({
            code: 400,
            message: "Error al suscribirse en la Newsletter.",
          });
        } else {
          res
            .status(200)
            .send({ code: 200, message: "Email suscrito en la Newsletter." });
          Mailer.sendEmailNewsletter(newsletterStore.email);
        }
      }
    });
  }
}

module.exports = {
  suscribeEmail,
};
