"use strict";
const express = require("express");
const chalk = require("chalk");
const path = __dirname + "/../views/";
const fileUpload = require("express-fileupload");

// Routers
const api = require("./api");
const ui = require("./ui");

const app = express();
const morgan = require("morgan");

const bodyParser = require("body-parser");
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../public"));
app.set("view engine", "pug");
app.use(fileUpload());

/**
 * startRESTAPi
 * @param {*} conf
 * @param {*} cache
 * @param {*} db
 */
function startRESTApi(conf, cache, db) {
  console.log("--- starting web components");
  console.log(path);
  const port = process.env.PORT || conf.webPort;
  const apiRouter = api.router(conf, cache, db);
  app.use(apiRouter);
  const uiRouter = ui.router(cache, db, path, conf);
  app.use(uiRouter);
  app.listen(port, function() {
    console.log(chalk.yellow("Listening on port: " + conf.webPort));
  });
}

module.exports.startRESTApi = startRESTApi;
