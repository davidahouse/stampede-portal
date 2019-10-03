/**
 * handle recentBuilds
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const builds = await db.recentBuilds()
  res.render(path + 'recentBuilds', {builds: builds.rows})
}

module.exports.handle = handle
