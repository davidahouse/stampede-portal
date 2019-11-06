/**
 * handle tasks
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const taskDetails = await cache.fetchTaskConfig(req.query.taskID);
  console.dir(taskDetails);
  const workerConfig = [];
  if (taskDetails.worker != null) {
    Object.keys(taskDetails.worker).forEach(function(key) {
      workerConfig.push({ key: key, value: taskDetails.worker[key] });
    });
  }
  res.render(path + 'admin/taskConfig', {
    taskID: req.query.taskID,
    taskDetails: taskDetails,
    config: taskDetails.config != null ? taskDetails.config : [],
    workerConfig: workerConfig
  });
}

module.exports.handle = handle;
