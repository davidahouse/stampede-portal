/**
 * handle tasks
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const builds = await db.recentBuilds(8);
  res.render(path + "history/builds", { builds: builds.rows });
}

module.exports.handle = handle;