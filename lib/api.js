'use strict'
const express = require('express')

const activeBuilds = require('../api/activeBuilds')

/**
 * router
 * @param {*} serverConf
 * @param {*} cache
 * @param {*} db
 * @return {object} router for the api paths
 */
function router(serverConf, cache, db) {
  const basicRouter = express.Router()

  basicRouter.get('/api/activeBuilds', function(req, res) {
    activeBuilds.handle(req, res, serverConf, cache, db)
  })

  return basicRouter
}

module.exports.router = router
