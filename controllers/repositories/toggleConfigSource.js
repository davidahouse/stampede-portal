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

  if (req.query.configSource === "Repository .stampede.yaml") {
    res.render(path + "repositories/toggleConfigSource", {
      owner: owner,
      repository: repository
    });
  } else {
    await cache.removeRepoConfig(owner, repository);
    res.writeHead(301, {
      Location:
        "/repositories/repositoryDetails?owner=" +
        owner +
        "&repository=" +
        repository
    });
    res.end();
  }
}

module.exports.handle = handle;
