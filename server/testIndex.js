const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 4001;
const { IP_SERVER, PORT_DB } = require("./config");

mongoose.set("useFindAndModify", false);

mongoose.connect(
  `mongodb://${IP_SERVER}:${PORT_DB}/kingdomgamer`,
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
