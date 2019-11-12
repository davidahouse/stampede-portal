#!/usr/bin/env node
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

const web = require("../lib/web");
const notifications = require("../lib/notifications");
const db = require("../lib/db");

require("pkginfo")(module);
const cache = require("stampede-cache");

const conf = require("rc")("stampede", {
  // defaults
  redisHost: "localhost",
  redisPort: 6379,
  redisPassword: null,
  webPort: 7744,
  // postgres
  dbHost: "localhost",
  dbDatabase: "stampede",
  dbUser: "postgres",
  dbPassword: null,
  dbPort: 54320,
  dbCert: null,
  notificationQueue: "portal"
});

clear();
console.log(
  chalk.red(figlet.textSync("stampede-portal", { horizontalLayout: "full" }))
);
console.log(chalk.yellow(module.exports.version));
console.log(chalk.red("Redis Host: " + conf.redisHost));
console.log(chalk.red("Redis Port: " + conf.redisPort));
console.log(chalk.red("Web Port: " + conf.webPort));
console.log(chalk.red("DB Host: " + conf.dbHost));
console.log(chalk.red("DB Port: " + conf.dbPort));

// Initialize our cache
db.start(conf);
cache.startCache(conf);
notifications.start(conf, db);
web.startRESTApi(conf, cache, db);
