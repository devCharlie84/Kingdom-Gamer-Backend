const nodemailer = require("nodemailer");
const { MAIL_USER, MAIL_PASSWORD } = require("../config");

function sendEmailNewsletter(email) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  let info = {
    from: '"🏰 KingdomGamer 🏰" <kingdomgamergt@gmail.com>',
    to: email,
    subject: "¡Gracias por subscribirte a nuestra Newsletter!",
    html: `
    <table style="height: 366px;" border="1" width="632" cellspacing="5" cellpadding="10" bgcolor="#000033">
<tbody>
<tr>
<td style="width: 599.333px;" bgcolor=""><br /><a href="https://postimages.org/" target="_blank"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://i.postimg.cc/Twd2ZNX8/logo-kg.png" alt="logo-kg" width="214" height="84" border="0" /></a>
<h1 style="color: #fff; text-align: center;">Bienvenido</h1>
<h3 style="color: #e84393; text-align: center;">${email}</h3>
<p style="color: #fff; text-align: center;">Al Newsletter de Kingdom Gamer</p>
</td>
</tr>
<tr bgcolor="#fff">
<td style="text-align: center; width: 599.333px;">
<p style="color: #000;">Se te enviará las últimas noticias del mundo de los videojuegos.</p>
</td>
</tr>
</tbody>
</table>
        `,
  };
  transporter.sendMail(info, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Correo enviado correctamente");
    }
  });
}

function sendEmailRegister(name, lastname, email) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  let info = {
    from: '"🏰 KingdomGamer 🏰" <kingdomgamergt@gmail.com>',
    to: email,
    subject: "¡Gracias por ser parte de Kingdom Gamer!",
    html: `
      <table style="height: 366px;" border="1" width="632" cellspacing="5" cellpadding="10" bgcolor="#000033">
  <tbody>
  <tr>
  <td style="width: 599.333px;" bgcolor=""><br /><a href="https://postimages.org/" target="_blank"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://i.postimg.cc/Twd2ZNX8/logo-kg.png" alt="logo-kg" width="214" height="84" border="0" /></a>
  <h1 style="color: #fff; text-align: center;">Bienvenido a la familia</h1>
  <h3 style="color: #e84393; text-align: center;">Hola ${name} ${lastname}</h3>
  <p style="color: #fff; text-align: center;">Gracias por registrarte como administrador para Kingdom Gamer. Espera a que uno de nuestros administradores activen tu cuenta ${email} para poder iniciar sesión y poder tener acceso a todas las funcionalidades como administrador KingdomGamer.</p>
  </td>
  </tr>
  <tr bgcolor="#fff">
  <td style="text-align: center; width: 599.333px;">
  <p style="color: #000;">Las últimas noticias de los videojuegos a tu alcance.</p>
  </td>
  </tr>
  </tbody>
  </table>
          `,
  };
  transporter.sendMail(info, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Correo enviado correctamente");
    }
  });
}

//*TO DO*//
function sendEmailForgetPassword(email) {}

module.exports = {
  sendEmailNewsletter,
  sendEmailRegister,
  sendEmailForgetPassword,
};
