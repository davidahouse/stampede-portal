'use strict'

/**
 * handle activeBuilds
 * @param {*} req
 * @param {*} res
 * @param {*} serverConf
 * @param {*} cache
 * @param {*} db
 */
async function handle(req, res, serverConf, cache, db) {
  const activeBuilds = await cache.fetchActiveBuilds()
  let prefix = req.query.repository != null ?
    '-' + req.query.repository : ''
  if (req.query.owner != null) {
    prefix = req.query.owner + prefix
  }
  const filteredBuilds = activeBuilds.filter(build => build.startsWith(prefix))
  const builds = []
  for (let index = 0; index < filteredBuilds.length; index++) {
    const buildID = filteredBuilds[index]
    const buildDetails = await db.fetchBuild(buildID)
    const tasks = await db.fetchBuildTasks(buildID)
    builds.push({
      buildID: buildID,
      buildDetails: (buildDetails != null && buildDetails.rows.length > 0) ?
                buildDetails.rows[0] : {},
      tasks: tasks.rows,
    })
  }
  res.send(builds)
}

module.exports.handle = handle
