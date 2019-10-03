/**
 * handle buildDetails
 * @param {*} req 
 * @param {*} res 
 * @param {*} cache
 * @param {*} db
 * @param {*} path 
 */
async function handle(req, res, cache, db, path) {
  res.render(path + 'buildDetails', {build: {}})
}

module.exports.handle = handle
