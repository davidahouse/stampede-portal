'use strict';
const express = require('express');

const activeBuilds = require('../api/activeBuilds');
const repositories = require('../api/repositories');
const buildDetails = require('../api/buildDetails');
const workerStatus = require('../api/workerStatus');
const recentBuilds = require('../api/recentBuilds');

// Admin
const adminTasks = require('../api/admin/tasks');

/**
 * router
 * @param {*} serverConf
 * @param {*} cache
 * @param {*} db
 * @return {object} router for the api paths
 */
function router(serverConf, cache, db) {
  const basicRouter = express.Router();

  basicRouter.get('/api/activeBuilds', function(req, res) {
    activeBuilds.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get('/api/repositories', function(req, res) {
    repositories.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get('/api/buildDetails', function(req, res) {
    buildDetails.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get('/api/workerStatus', function(req, res) {
    workerStatus.handle(req, res, serverConf, cache, db);
  });

  basicRouter.get('/api/recentBuilds', function(req, res) {
    recentBuilds.handle(req, res, serverConf, cache, db);
  });

  // Admin

  basicRouter.get('/api/admin/tasks', function(req, res) {
    adminTasks.handle(req, res, serverConf, cache, db);
  });

  return basicRouter;
}

module.exports.router = router;
