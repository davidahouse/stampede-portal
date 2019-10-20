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
  const overrides = await cache.fetchSystemOverrides();
  res.send(overrides != null ? overrides : { overrides: {} });
}

module.exports.handle = handle;
