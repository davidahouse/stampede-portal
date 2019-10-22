"use strict";
const express = require("express");

// Controllers
const index = require("../controllers/index");

// Repositories
const repositories = require("../controllers/repositories/repositories");
const repositoryDetails = require("../controllers/repositories/repositoryDetails");

// Monitor
const monitor = require("../controllers/monitor/monitor");
const monitorActiveBuilds = require("../controllers/monitor/activeBuilds");
const monitorTrendingFailures = require("../controllers/monitor/trendingFailures");
const monitorBuildSummary = require("../controllers/monitor/buildSummary");

// History
const history = require("../controllers/history/history");
const historyBuilds = require("../controllers/history/builds");
const historyTasks = require("../controllers/history/tasks");

// Admin
const admin = require("../controllers/admin/admin");
const adminTasks = require("../controllers/admin/tasks");
const adminDefaults = require("../controllers/admin/defaults");
const adminOverrides = require("../controllers/admin/overrides");
const adminQueues = require("../controllers/admin/queues");

// Misc top level controllers
const buildDetails = require("../controllers/buildDetails");

/**
 * router
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 * @return {*} the router for UI controllers
 */
function router(cache, db, path) {
  const basicRouter = express.Router();

  basicRouter.get("/", function(req, res) {
    index.handle(req, res, cache, db, path);
  });

  // Repositories

  basicRouter.get("/repositories", function(req, res) {
    repositories.handle(req, res, cache, db, path);
  });

  basicRouter.get("/repositories/repositoryDetails", function(req, res) {
    repositoryDetails.handle(req, res, cache, db, path);
  });

  // Monitor

  basicRouter.get("/monitor", function(req, res) {
    monitor.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/activeBuilds", function(req, res) {
    monitorActiveBuilds.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/buildSummary", function(req, res) {
    monitorBuildSummary.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/trendingFailures", function(req, res) {
    monitorTrendingFailures.handle(req, res, cache, db, path);
  });

  // History

  basicRouter.get("/history", function(req, res) {
    history.handle(req, res, cache, db, path);
  });

  basicRouter.get("/history/builds", function(req, res) {
    historyBuilds.handle(req, res, cache, db, path);
  });

  basicRouter.get("/history/tasks", function(req, res) {
    historyTasks.handle(req, res, cache, db, path);
  });

  // Admin

  basicRouter.get("/admin", function(req, res) {
    admin.handle(req, res, cache, db, path);
  });

  basicRouter.get("/admin/tasks", function(req, res) {
    adminTasks.handle(req, res, cache, db, path);
  });

  basicRouter.get("/admin/defaults", function(req, res) {
    adminDefaults.handle(req, res, cache, db, path);
  });

  basicRouter.get("/admin/overrides", function(req, res) {
    adminOverrides.handle(req, res, cache, db, path);
  });

  basicRouter.get("/admin/queues", function(req, res) {
    adminQueues.handle(req, res, cache, db, path);
  });

  // Top level build/task info

  basicRouter.get("/buildDetails", function(req, res) {
    buildDetails.handle(req, res, cache, db, path);
  });

  return basicRouter;
}

module.exports.router = router;
