const {Pool} = require('pg')

let pool

/**
 * start
 * @param {*} conf
 */
async function start(conf) {
  pool = new Pool({
    user: conf.dbUser,
    host: conf.dbHost,
    database: conf.dbDatabase,
    password: conf.dbPassword,
    port: conf.dbPort,
  })

  await createTables()
}

/**
 * storeRepository
 * @param {*} owner
 * @param {*} repository
 * @return {*} repository id
 */
async function storeRepository(owner, repository) {
  const insert = 'INSERT INTO repositories (owner, repository) VALUES ($1, $2) ON CONFLICT DO NOTHING;'
  return await pool.query(insert, [owner, repository])
}

/**
 * fetchRepositories
 */
async function fetchRepositories() {
  const query = 'SELECT * FROM REPOSITORIES ORDER BY owner, repository'
  return await pool.query(query)
}

/**
 * storeBuildStart
 * @param {*} owner
 * @param {*} repository
 * @param {*} buildKey
 * @param {*} build
 */
async function storeBuildStart(owner, repository, buildKey, build) {
  const insert = 'INSERT INTO builds (owner, repository, buildKey, build, status) \
    VALUES ($1, $2, $3, $4, $5);'
  return await pool.query(insert, [owner, repository, buildKey, build, 'started'])
}

/**
 * storeBuildComplete
 * @param {*} owner
 * @param {*} repository
 * @param {*} buildKey
 * @param {*} build
 */
async function storeBuildComplete(owner, repository, buildKey, build) {
  const update = 'UPDATE builds set status = $5 where owner = $1 and repository = $2 \
    and buildKey = $3 and build = $4;'
  return await pool.query(update, [owner, repository, buildKey, build, 'completed'])
}

/**
 * activeBuilds
 */
async function activeBuilds() {
  const query = 'SELECT * from builds where status = $1'
  return await pool.query(query, ['started'])
}

/**
 * recentBuilds
 */
async function recentBuilds() {
  // TODO: Add a date diff here so we only get recent builds, not
  // all completed builds
  const query = 'SELECT * from builds where status = $1'
  return await pool.query(query, ['completed'])
}

/**
 * fetchBuild
 * @param {*} owner
 * @param {*} repository
 * @param {*} buildKey
 * @param {*} build
 */
async function fetchBuild(owner, repository, buildKey, build) {
  const query = 'SELECT * from builds where owner = $1 and \
    repository = $2 and buildKey = $3 and build = $4;'
  return await pool.query(query, [owner, repository, buildKey, build])
}

/**
 * fetchBuildTasks
 * @param {*} owner
 * @param {*} repository
 * @param {*} buildKey
 * @param {*} build
 */
async function fetchBuildTasks(owner, repository, buildKey, build) {
  const query = 'SELECT * from tasks where owner = $1 and \
    repository = $2 and buildKey = $3 and build = $4 ORDER BY tasknumber;'
  return await pool.query(query, [owner, repository, buildKey, build])
}

/**
 * storeTaskStart
 * @param {*} owner
 * @param {*} repository
 * @param {*} buildKey
 * @param {*} build
 * @param {*} taskID
 * @param {*} taskNumber
 * @param {*} status
 */
async function storeTaskStart(owner, repository, buildKey, build, taskID, taskNumber, status) {
  const insert = 'INSERT INTO tasks (owner, repository, buildKey, build, taskID, taskNumber, status) \
    VALUES ($1, $2, $3, $4, $5, $6, $7);'
  return await pool.query(insert, [owner, repository, buildKey, build, taskID, taskNumber, status])
}

/**
 * storeTaskUpdate
 * @param {*} owner
 * @param {*} repository
 * @param {*} buildKey
 * @param {*} build
 * @param {*} taskID
 * @param {*} taskNumber
 * @param {*} status
 */
async function storeTaskUpdate(owner, repository, buildKey, build, taskID, taskNumber, status) {
  const update = 'UPDATE tasks set status = $7 where owner = $1 and repository = $2 \
   and buildKey = $3 and build = $4 and taskID = $5 and taskNumber = $6;'
  return await pool.query(update, [owner, repository, buildKey, build, taskID, taskNumber, status])
}

/**
 * createTables
 */
async function createTables() {
  await pool.query('CREATE TABLE IF NOT EXISTS repositories \
    (owner varchar, repository varchar, \
    PRIMARY KEY (owner, repository));')

  await pool.query('CREATE TABLE IF NOT EXISTS builds \
    (owner varchar, repository varchar, buildKey varchar, build int, \
      status varchar, \
    PRIMARY KEY (owner, repository, buildKey, build));')

  await pool.query('CREATE TABLE IF NOT EXISTS tasks \
    (owner varchar, repository varchar, buildKey varchar, build int, \
      taskID varchar, taskNumber int, status varchar, \
      PRIMARY KEY (owner, repository, buildKey, build, taskID, taskNumber));')
}

module.exports.start = start
module.exports.storeRepository = storeRepository
module.exports.fetchRepositories = fetchRepositories

module.exports.storeBuildStart = storeBuildStart
module.exports.storeBuildComplete = storeBuildComplete
module.exports.activeBuilds = activeBuilds
module.exports.recentBuilds = recentBuilds
module.exports.fetchBuild = fetchBuild

module.exports.storeTaskStart = storeTaskStart
module.exports.storeTaskUpdate = storeTaskUpdate
module.exports.fetchBuildTasks = fetchBuildTasks
