const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 4001;
// const { IP_SERVER, PORT_DB } = require("./config");
require("dotenv").config();

mongoose.set("useFindAndModify", false);

mongoose.connect(
  process.env.DB_CONN,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      app.listen(port, () => {});
    }
  }
);

module.exports = app;
