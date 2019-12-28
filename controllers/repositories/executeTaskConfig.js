/**
 * handle executeTaskSelection
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const owner = req.body.owner;
  const repository = req.body.repository;

  const taskDetails = await cache.fetchTaskConfig(req.body.task);
  const scm = [];
  scm.push({ key: "clone url" });
  scm.push({ key: "ssh url" });
  if (req.body.buildType === "Pull Request") {
    scm.push({ key: "pr number" });
    scm.push({ key: "pr title" });
    scm.push({ key: "head ref" });
    scm.push({ key: "head sha" });
    scm.push({ key: "base ref" });
    scm.push({ key: "base sha" });
  } else if (req.body.buildType === "Branch") {
    scm.push({ key: "branch name" });
    scm.push({ key: "branch sha" });
  } else if (req.body.buildType === "Release") {
    scm.push({ key: "release name" });
    scm.push({ key: "release tag" });
  }

  const taskQueue = taskDetails.taskQueue;

  res.render(path + "repositories/executeTaskConfig", {
    owner: owner,
    repository: repository,
    task: req.body.task,
    buildType: req.body.buildType,
    config: taskDetails.config != null ? taskDetails.config : [],
    scm: scm,
    taskQueue: taskQueue
  });
}

module.exports.handle = handle;
