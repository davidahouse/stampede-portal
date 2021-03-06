"use strict";
const express = require("express");

const activeBuilds = require("../api/activeBuilds");
const activeTasks = require("../api/activeTasks");
const repositories = require("../api/repositories");
const buildDetails = require("../api/buildDetails");
const workerStatus = require("../api/workerStatus");
const recentBuilds = require("../api/recentBuilds");
const queueSummary = require("../api/queueSummary");

// Admin
const adminTasks = require("../api/admin/tasks");
const adminConfigDefaults = require("../api/admin/configDefaults");
const adminConfigOverrides = require("../api/admin/configOverrides");
const adminQueues = require("../api/admin/queues");

/**
 * router
 * @param {*} serverConf
 * @param {*} cache
 * @param {*} db
 * @return {object} router for the api paths
 */
function router(serverConf, cache, db) {
  const basicRouter = express.Router();

  basicRouter.get("/api/activeBuilds", function(req, res) {
    activeBuilds.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get("/api/activeTasks", function(req, res) {
    activeTasks.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get("/api/repositories", function(req, res) {
    repositories.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get("/api/buildDetails", function(req, res) {
    buildDetails.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get("/api/workerStatus", function(req, res) {
    workerStatus.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get("/api/recentBuilds", function(req, res) {
    recentBuilds.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get("/api/queueSummary", function(req, res) {
    queueSummary.handle(req, res, serverConf, cache, db);
  });

  // Admin

  basicRouter.get("/api/admin/tasks", function(req, res) {
    adminTasks.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get("/api/admin/configDefaults", function(req, res) {
    adminConfigDefaults.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get("/api/admin/configOverrides", function(req, res) {
    adminConfigOverrides.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get("/api/admin/queues", function(req, res) {
    adminQueues.handle(req, res, serverConf, cache, db);
  });

  return basicRouter;
}

module.exports.router = router;
