/**
 * handle buildDetails
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  console.dir(req.query)
  const build = await db.fetchBuild(req.query.owner, req.query.repository, req.query.buildKey, req.query.build)
  const buildTasks = await db.fetchBuildTasks(req.query.owner, req.query.repository,
    req.query.buildKey, req.query.build)
  const buildDetails = build.rows.length > 0 ? build.rows[0] : {}
  const tasks = []
  for (let index = 0; index < buildTasks.rows.length; index++) {
    const taskDetails = await cache.fetchTaskConfig(buildTasks.rows[index].taskid)
    const task = buildTasks.rows[index]
    task.title = taskDetails.title
    tasks.push(task)
  }
  res.render(path + 'buildDetails', {build: buildDetails, tasks: tasks})
}

module.exports.handle = handle
