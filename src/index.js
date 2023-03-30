Promise = require("bluebird");
// const { port } = require("./config/vars");
// const mongoose = require('./config/mongoose');
var models = require("../src/api/models");
const app = require("./config/express");
app.set("view engine", "ejs");
const http = require("http");
// mongoose.connect();
const port = 8080;

models.sequelize.sync().then(function () {
  //   app.listen(port);
  http.createServer(app).listen(port);

});


console.log(`servers is running on ${port}` )



// http.createServer(app).listen(port);
// console.log(`App is running on ${port}`);
module.exports = app;