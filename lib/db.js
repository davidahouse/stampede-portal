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
 * @param {*} buildID
 * @param {*} owner
 * @param {*} repository
 * @param {*} buildKey
 * @param {*} build
 */
async function storeBuildStart(buildID, owner, repository, buildKey, build) {
  const insert = 'INSERT INTO builds (buildID, owner, repository, buildKey, build, status, startedAt) \
    VALUES ($1, $2, $3, $4, $5, $6, $7);'
  return await pool.query(insert, [buildID, owner, repository, buildKey, build, 'started', new Date()])
}

/**
 * storeBuildComplete
 * @param {*} buildID
 */
async function storeBuildComplete(buildID) {
  try {
    const update = 'UPDATE builds set status = $2, completedAt = $3 \
    where buildID = $1;'
    return await pool.query(update, [buildID, 'completed', new Date()])
  } catch (e) {
    console.log('Error in storeBuildComplete: ' + e)
  }
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
  const query = 'SELECT * from builds where status = $1 order by completedAt DESC'
  return await pool.query(query, ['completed'])
}

/**
 * fetchBuild
 * @param {*} buildID
 */
async function fetchBuild(buildID) {
  const query = 'SELECT * from builds where buildID = $1;'
  return await pool.query(query, [buildID])
}

/**
 * fetchBuildTasks
 * @param {*} buildID
 */
async function fetchBuildTasks(buildID) {
  const query = 'SELECT * from tasks where buildID = $1;'
  return await pool.query(query, [buildID])
}

/**
 * fetchFailedTasks
 */
async function fetchFailedTasks() {
  const query = 'SELECT * from tasks where conclusion = $1 ORDER BY completedAt DESC;'
  return await pool.query(query, ['failure'])
}

/**
 * storeTaskStart
 * @param {*} taskID
 * @param {*} buildID
 * @param {*} task
 * @param {*} status
 * @param {*} queuedAt
 */
async function storeTaskStart(taskID, buildID, task, status, queuedAt) {
  const insert = 'INSERT INTO tasks (taskID, buildID, task, \
    status, queuedAt) \
    VALUES ($1, $2, $3, $4, $5);'
  return await pool.query(insert, [taskID, buildID, task, status, queuedAt])
}

/**
 * storeTaskUpdate
 * @param {*} taskID
 * @param {*} status
 * @param {*} startedAt
 */
async function storeTaskUpdate(taskID, status, startedAt) {
  const update = 'UPDATE tasks set status = $2, startedAt = $3 \
   where taskID = $1;'
  return await pool.query(update, [taskID, status, startedAt])
}

/**
 * storeTaskCompleted
 * @param {*} taskID
 * @param {*} status
 * @param {*} finishedAt
 * @param {*} duration
 * @param {*} conclusion
 */
async function storeTaskCompleted(taskID, status, finishedAt, duration, conclusion) {
  const update = 'UPDATE tasks set status = $2, completedAt = $3, duration = $4, \
   conclusion = $5 \
   where taskID = $1;'
  return await pool.query(update, [taskID, status, finishedAt, duration, conclusion])
}

/**
 * storeTaskDetails
 * @param {*} taskID
 * @param {*} details
 */
async function storeTaskDetails(taskID, details) {
  const insert = 'INSERT INTO taskDetails (taskID, details) \
    VALUES ($1, $2);'
  return await pool.query(insert, [taskID, details])
}

/**
 * storeTaskDetailsUpdate
 * @param {*} taskID
 * @param {*} details
 */
async function storeTaskDetailsUpdate(taskID, details) {
  const update = 'UPDATE taskDetails set details = $2 \
    WHERE taskID = $1;'
  return await pool.query(update, [taskID, details])
}

/**
 * createTables
 */
async function createTables() {
  await pool.query('CREATE TABLE IF NOT EXISTS repositories \
    (owner varchar, \
      repository varchar, \
    PRIMARY KEY (owner, repository));')

  await pool.query('CREATE TABLE IF NOT EXISTS builds \
    (buildID varchar, \
      owner varchar, \
      repository varchar, \
      buildKey varchar, \
      build int, \
      status varchar, \
      startedAt timestamptz, \
      completedAt timestamptz, \
    PRIMARY KEY (buildID));')

  await pool.query('CREATE TABLE IF NOT EXISTS tasks \
    (taskID varchar, \
      buildID varchar, \
      task varchar, \
      status varchar, \
      conclusion varchar, \
      queuedAt timestamptz, \
      startedAt timestamptz, \
      completedAt timestamptz, \
      duration int, \
      PRIMARY KEY (taskID));')

  await pool.query('CREATE TABLE IF NOT EXISTS taskDetails \
    (taskID varchar, \
      details jsonb, \
      PRIMARY KEY (taskID));')
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
module.exports.storeTaskCompleted = storeTaskCompleted
module.exports.fetchBuildTasks = fetchBuildTasks
module.exports.fetchFailedTasks = fetchFailedTasks

module.exports.storeTaskDetails = storeTaskDetails
module.exports.storeTaskDetailsUpdate = storeTaskDetailsUpdate
