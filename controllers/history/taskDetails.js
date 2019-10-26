/**
 * handle taskDetails
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const taskDetails = await db.fetchTask(req.query.taskID);
  const task = taskDetails.rows[0];
  const buildDetails = await db.fetchBuild(task.build_id);
  const build = buildDetails.rows[0];
  res.render(path + "history/taskDetails", { task: task, build: build });
}

module.exports.handle = handle;
