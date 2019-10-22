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

  // TODO:
  // Fix once we can run npm install and get this method from the cache
  const buildNumber = 42;
  // const buildNumber = await cache.fetchBuildNumber(
  //   foundRepositories[index].owner +
  //     "-" +
  //     foundRepositories[index].repo +
  //     "-buildNumber"
  // );

  const activeBuilds = await db.activeBuilds(owner, repository);
  const recentBuilds = await db.recentBuilds(8, owner, repository);

  res.render(path + "repositories/repositoryDetails", {
    owner: owner,
    repository: repository,
    nextBuildNumber: buildNumber,
    activeBuilds: activeBuilds.rows,
    recentBuilds: recentBuilds.rows
  });
}

module.exports.handle = handle;
