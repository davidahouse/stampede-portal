/**
 * handle buildDetails
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const build = await db.fetchBuild(req.query.buildID)
  const buildTasks = await db.fetchBuildTasks(req.query.buildID)
  const buildDetails = build.rows.length > 0 ? build.rows[0] : {}
  const tasks = []
  for (let index = 0; index < buildTasks.rows.length; index++) {
    const taskDetails = await cache.fetchTaskConfig(buildTasks.rows[index].task)
    const task = buildTasks.rows[index]
    task.title = taskDetails.title
    tasks.push(task)
  }
  res.render(path + 'buildDetails', {build: buildDetails, tasks: tasks})
}

module.exports.handle = handle
