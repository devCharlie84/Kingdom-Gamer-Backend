const app = require("./app");
const port = process.env.PORT || 4000;
const { API_VERSION, IP_SERVER } = require("./config");

app.listen(port, () => {
  console.log("#####################################");
  console.log(`###### LISTENING ON PORT ${port} #######`);
  console.log("#####################################");

  console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
});
