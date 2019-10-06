/**
 * handle trendingFailures
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const failures = await db.fetchFailedTasks()
  res.render(path + 'trendingFailures', {failures: failures.rows})
}

module.exports.handle = handle
