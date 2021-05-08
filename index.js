const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 4000;
// const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");
require("dotenv").config();

mongoose.set("useFindAndModify", false);

mongoose.connect(
  "mongodb+srv://camoralesl_97:SecureP@ssw0rd1997@kingdomgamer.pvils.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("Conexión con Mongoose correctamente");

      app.listen(process.env.PORT, "0.0.0.0", () => {
        console.log("########################");
        console.log("##### KINGDOM GAMER ####");
        console.log("######## BACKEND #######");
        console.log("########################");
      });
    }
  }
);
module.exports = app;
