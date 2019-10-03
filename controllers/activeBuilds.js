/**
 * handle activeBuilds
 * @param {*} req 
 * @param {*} res 
 * @param {*} cache
 * @param {*} db
 * @param {*} path 
 */
async function handle(req, res, cache, db, path) {
  const builds = await db.activeBuilds()
  res.render(path + 'activeBuilds', {builds: builds.rows})
}

module.exports.handle = handle
