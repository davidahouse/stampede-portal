const Queue = require('bull');

/**
 * handle requeueTask
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path, redisConfig) {
  const taskRows = await db.fetchTask(req.query.taskID);
  const task = taskRows.rows[0];
  const detailsRows = await db.fetchTaskDetails(req.query.taskID);
  const taskDetails = detailsRows.rows[0].details;

  taskDetails.stats.started_at = null;
  taskDetails.stats.finished_at = null;
  taskDetails.worker = {};
  taskDetails.result = {};
  taskDetails.staus = 'queued';
  console.dir(taskDetails);

  // Figure out the task queue
  const taskQueue = new Queue('stampede-' + taskDetails.taskQueue, redisConfig);
  taskQueue.add(taskDetails, { removeOnComplete: true, removeOnFail: true });
  taskQueue.close();

  res.render(path + 'monitor/requeueTask', {
    task: task,
    taskDetails: taskDetails
  });
}

module.exports.handle = handle;
