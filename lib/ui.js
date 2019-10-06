'use strict'
const express = require('express')

// Controllers
const index = require('../controllers/index')
const repositories = require('../controllers/repositories')
const activeBuilds = require('../controllers/activeBuilds')
const recentBuilds = require('../controllers/recentBuilds')
const buildSummary = require('../controllers/buildSummary')
const buildDetails = require('../controllers/buildDetails')
const tasks = require('../controllers/tasks')
const trendingFailures = require('../controllers/trendingFailures')

/**
 * router
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 * @return {*} the router for UI controllers
 */
function router(cache, db, path) {
  const basicRouter = express.Router()

  basicRouter.get('/', function(req, res) {
    index.handle(req, res, cache, db, path)
  })

  basicRouter.get('/repositories', function(req, res) {
    repositories.handle(req, res, cache, db, path)
  })

  basicRouter.get('/activeBuilds', function(req, res) {
    activeBuilds.handle(req, res, cache, db, path)
  })

  basicRouter.get('/recentBuilds', function(req, res) {
    recentBuilds.handle(req, res, cache, db, path)
  })

  basicRouter.get('/buildSummary', function(req, res) {
    buildSummary.handle(req, res, cache, db, path)
  })

  basicRouter.get('/buildDetails', function(req, res) {
    buildDetails.handle(req, res, cache, db, path)
  })

  basicRouter.get('/tasks', function(req, res) {
    tasks.handle(req, res, cache, db, path)
  })

  basicRouter.get('/trendingFailures', function(req, res) {
    trendingFailures.handle(req, res, cache, db, path)
  })

  return basicRouter
}

module.exports.router = router
