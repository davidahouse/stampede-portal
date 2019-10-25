/**
 * handle tasks
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const tasks = await db.recentTasks(8);
  res.render(path + "history/tasks", { tasks: tasks.rows });
}

module.exports.handle = handle;
