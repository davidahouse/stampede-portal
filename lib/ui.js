"use strict";
const express = require("express");

// Controllers
const index = require("../controllers/index");

// Repositories
const repositories = require("../controllers/repositories/repositories");
const repositoryDetails = require("../controllers/repositories/repositoryDetails");
const repositoryBuildDetails = require("../controllers/repositories/buildDetails");
const repositoryTaskDetails = require("../controllers/repositories/taskDetails");
const repositoryRequeueTask = require("../controllers/repositories/requeueTask");

// Monitor
const monitorActiveBuilds = require("../controllers/monitor/activeBuilds");
const monitorActiveTasks = require("../controllers/monitor/activeTasks");
const monitorTrendingFailures = require("../controllers/monitor/trendingFailures");
const monitorBuildSummary = require("../controllers/monitor/buildSummary");
const monitorWorkers = require("../controllers/monitor/workers");
const monitorWorkerDetails = require("../controllers/monitor/workerDetails");
const monitorBuildDetails = require("../controllers/monitor/buildDetails");
const monitorBuildTaskDetails = require("../controllers/monitor/buildTaskDetails");
const monitorQueues = require("../controllers/monitor/queues");
const monitorRequeueTask = require("../controllers/monitor/requeueTask");

// History
const historyBuilds = require("../controllers/history/builds");
const historyTasks = require("../controllers/history/tasks");
const historyBuildDetails = require("../controllers/history/buildDetails");
const historyBuildTaskDetails = require("../controllers/history/buildTaskDetails");
const historyTaskDetails = require("../controllers/history/taskDetails");
const historyRequeueTask = require("../controllers/history/requeueTask");

// Admin
const adminTasks = require("../controllers/admin/tasks");
const adminTaskConfig = require("../controllers/admin/taskConfig");
const adminDefaults = require("../controllers/admin/defaults");
const adminOverrides = require("../controllers/admin/overrides");
const adminQueues = require("../controllers/admin/queues");
const adminInfo = require("../controllers/admin/info");

// Misc top level controllers

/**
 * router
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 * @param {*} conf
 * @return {*} the router for UI controllers
 */
function router(cache, db, path, conf) {
  const basicRouter = express.Router();

  const redisConfig = {
    redis: {
      port: conf.redisPort,
      host: conf.redisHost,
      password: conf.redisPassword
    }
  };

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

  basicRouter.get("/repositories/buildDetails", function(req, res) {
    repositoryBuildDetails.handle(req, res, cache, db, path);
  });

  basicRouter.get("/repositories/taskDetails", function(req, res) {
    repositoryTaskDetails.handle(req, res, cache, db, path);
  });

  basicRouter.get("/repositories/requeueTask", function(req, res) {
    repositoryRequeueTask.handle(req, res, cache, db, path, redisConfig);
  });

  // Monitor

  basicRouter.get("/monitor/activeBuilds", function(req, res) {
    monitorActiveBuilds.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/activeTasks", function(req, res) {
    monitorActiveTasks.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/buildSummary", function(req, res) {
    monitorBuildSummary.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/trendingFailures", function(req, res) {
    monitorTrendingFailures.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/workers", function(req, res) {
    monitorWorkers.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/workerDetails", function(req, res) {
    monitorWorkerDetails.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/buildDetails", function(req, res) {
    monitorBuildDetails.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/buildTaskDetails", function(req, res) {
    monitorBuildTaskDetails.handle(req, res, cache, db, path);
  });

  basicRouter.get("/monitor/queues", function(req, res) {
    monitorQueues.handle(req, res, cache, db, path, conf);
  });

  basicRouter.get("/monitor/requeueTask", function(req, res) {
    monitorRequeueTask.handle(req, res, cache, db, path, redisConfig);
  });

  // History

  basicRouter.get("/history/builds", function(req, res) {
    historyBuilds.handle(req, res, cache, db, path);
  });

  basicRouter.get("/history/buildDetails", function(req, res) {
    historyBuildDetails.handle(req, res, cache, db, path);
  });

  basicRouter.get("/history/tasks", function(req, res) {
    historyTasks.handle(req, res, cache, db, path);
  });

  basicRouter.get("/history/buildTaskDetails", function(req, res) {
    historyBuildTaskDetails.handle(req, res, cache, db, path);
  });

  basicRouter.get("/history/taskDetails", function(req, res) {
    historyTaskDetails.handle(req, res, cache, db, path);
  });

  basicRouter.get("/history/requeueTask", function(req, res) {
    historyRequeueTask.handle(req, res, cache, db, path, redisConfig);
  });

  // Admin

  basicRouter.get("/admin/tasks", function(req, res) {
    adminTasks.handle(req, res, cache, db, path);
  });

  basicRouter.get("/admin/taskConfig", function(req, res) {
    adminTaskConfig.handle(req, res, cache, db, path);
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

  basicRouter.get("/admin/info", function(req, res) {
    adminInfo.handle(req, res, cache, db, path);
  });

  return basicRouter;
}

module.exports.router = router;
