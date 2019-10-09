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
  const insert = 'INSERT INTO stampede.repositories (owner, repository) VALUES ($1, $2) ON CONFLICT DO NOTHING;'
  return await pool.query(insert, [owner, repository])
}

/**
 * fetchRepositories
 */
async function fetchRepositories() {
  const query = 'SELECT * FROM stampede.repositories ORDER BY owner, repository'
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
  const insert = 'INSERT INTO stampede.builds (build_id, owner, repository, build_key, build, status, started_at) \
    VALUES ($1, $2, $3, $4, $5, $6, $7);'
  return await pool.query(insert, [buildID, owner, repository, buildKey, build, 'started', new Date()])
}

/**
 * storeBuildComplete
 * @param {*} buildID
 */
async function storeBuildComplete(buildID) {
  try {
    const update = 'UPDATE stampede.builds set status = $2, completed_at = $3 \
    where build_id = $1;'
    return await pool.query(update, [buildID, 'completed', new Date()])
  } catch (e) {
    console.log('Error in storeBuildComplete: ' + e)
  }
}

/**
 * activeBuilds
 */
async function activeBuilds() {
  const query = 'SELECT * from stampede.builds where status = $1'
  return await pool.query(query, ['started'])
}

/**
 * recentBuilds
 * @param {int} hours
 */
async function recentBuilds(hours) {
  const recent = new Date()
  recent.setHours(recent.getHours() - hours)
  const query = 'SELECT * FROM stampede.builds \
    WHERE status = $1 AND \
    completed_at >= $2 \
    ORDER BY completed_at DESC'
  return await pool.query(query, ['completed', recent])
}

/**
 * fetchBuild
 * @param {*} buildID
 */
async function fetchBuild(buildID) {
  const query = 'SELECT * from stampede.builds where build_id = $1;'
  return await pool.query(query, [buildID])
}

/**
 * fetchBuildTasks
 * @param {*} buildID
 */
async function fetchBuildTasks(buildID) {
  const query = 'SELECT * from stampede.tasks where build_id = $1;'
  return await pool.query(query, [buildID])
}

/**
 * fetchFailedTasks
 */
async function fetchFailedTasks() {
  const query = 'SELECT * from stampede.tasks where conclusion = $1 ORDER BY completed_at DESC;'
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
  const insert = 'INSERT INTO stampede.tasks (task_id, build_id, task, \
    status, queued_at) \
    VALUES ($1, $2, $3, $4, $5);'
  return await pool.query(insert, [taskID, buildID, task, status, queuedAt])
}

/**
 * storeTaskUpdate
 * @param {*} taskID
 * @param {*} status
 * @param {*} startedAt
 * @param {*} node
 */
async function storeTaskUpdate(taskID, status, startedAt, node) {
  const update = 'UPDATE stampede.tasks set status = $2, started_at = $3, \
  node = $4 \
   where task_id = $1;'
  return await pool.query(update, [taskID, status, startedAt, node])
}

/**
 * storeTaskCompleted
 * @param {*} taskID
 * @param {*} status
 * @param {*} finishedAt
 * @param {*} completedAt
 * @param {*} conclusion
 */
async function storeTaskCompleted(taskID, status, finishedAt, completedAt, conclusion) {
  const update = 'UPDATE stampede.tasks set status = $2, finished_at = $3, completed_at = $4, \
   conclusion = $5 \
   where task_id = $1;'
  return await pool.query(update, [taskID, status, finishedAt, completedAt, conclusion])
}

/**
 * storeTaskDetails
 * @param {*} taskID
 * @param {*} details
 */
async function storeTaskDetails(taskID, details) {
  const insert = 'INSERT INTO stampede.taskDetails (task_id, details) \
    VALUES ($1, $2);'
  return await pool.query(insert, [taskID, details])
}

/**
 * storeTaskDetailsUpdate
 * @param {*} taskID
 * @param {*} details
 */
async function storeTaskDetailsUpdate(taskID, details) {
  const update = 'UPDATE stampede.taskDetails set details = $2 \
    WHERE task_id = $1;'
  return await pool.query(update, [taskID, details])
}

/**
 * createTables
 */
async function createTables() {
  await pool.query('CREATE SCHEMA IF NOT EXISTS stampede;')

  await pool.query('CREATE TABLE IF NOT EXISTS stampede.repositories \
    (owner varchar, \
      repository varchar, \
    PRIMARY KEY (owner, repository));')

  await pool.query('CREATE TABLE IF NOT EXISTS stampede.builds \
    (build_id varchar, \
      owner varchar, \
      repository varchar, \
      build_key varchar, \
      build int, \
      status varchar, \
      started_at timestamptz, \
      completed_at timestamptz, \
    PRIMARY KEY (build_id));')

  await pool.query('CREATE TABLE IF NOT EXISTS stampede.tasks \
    (task_id varchar, \
      build_id varchar, \
      task varchar, \
      status varchar, \
      conclusion varchar, \
      queued_at timestamptz, \
      started_at timestamptz, \
      finished_at timestamptz, \
      completed_at timestamptz, \
      node varchar, \
      PRIMARY KEY (task_id));')

  await pool.query('CREATE TABLE IF NOT EXISTS stampede.taskDetails \
    (task_id varchar, \
      details jsonb, \
      PRIMARY KEY (task_id));')

  await pool.query('CREATE TABLE IF NOT EXISTS stampede.version \
    (version int);')
  await pool.query('DELETE FROM stampede.version;')
  await pool.query('INSERT into stampede.version (version) VALUES (1);')
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
