"use strict";

/**
 * handle
 * @param {*} req
 * @param {*} res
 * @param {*} serverConf
 * @param {*} cache
 * @param {*} db
 */
async function handle(req, res, serverConf, cache, db) {
  const defaults = await cache.fetchSystemDefaults();
  res.send(defaults != null ? defaults : { defaults: {} });
}

module.exports.handle = handle;
