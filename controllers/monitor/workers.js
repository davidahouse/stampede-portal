/**
 * handle workers
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const workers = await cache.fetchActiveWorkers();
  console.dir(workers);
  res.render(path + "monitor/workers", { workers: workers });
}

module.exports.handle = handle;
