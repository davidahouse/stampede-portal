/**
 * handle taskDetails
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const taskRows = await db.fetchTask(req.query.taskID);
  const task = taskRows.rows[0];
  const detailsRows = await db.fetchTaskDetails(req.query.taskID);
  const taskDetails = detailsRows.rows[0];
  const buildRows = await db.fetchBuild(task.build_id);
  const build = buildRows.rows[0];
  res.render(path + 'repositories/taskDetails', {
    task: task,
    build: build,
    taskDetails: taskDetails
  });
}

module.exports.handle = handle;
