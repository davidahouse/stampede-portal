/**
 * handle index
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const owner = req.query.owner;
  const repository = req.query.repository;

  const buildNumber = await cache.fetchBuildNumber(
    owner + "-" + repository + "-buildNumber"
  );

  const activeBuilds = await db.activeBuilds(owner, repository);
  const recentBuilds = await db.recentBuilds(8, owner, repository);

  res.render(path + "repositories/repositoryDetails", {
    owner: owner,
    repository: repository,
    nextBuildNumber: parseInt(buildNumber) + 1,
    activeBuilds: activeBuilds.rows,
    recentBuilds: recentBuilds.rows
  });
}

module.exports.handle = handle;
