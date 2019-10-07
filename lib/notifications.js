'use strict'

const chalk = require('chalk')
const Queue = require('bull')

/**
 * start
 * @param {*} conf
 * @param {*} db
 */
async function start(conf, db) {
  const redisConfig = {
    redis: {
      port: conf.redisPort,
      host: conf.redisHost,
      password: conf.redisPassword,
    },
  }
  const q = new Queue(conf.notificationQueue, redisConfig)
  q.process(function(job) {
    const payload = job.data.payload
    console.log(chalk.green(job.data.notification) + ' [' + chalk.yellow(job.data.id) + ']')

    if (job.data.notification === 'buildStarted') {
      db.storeRepository(payload.owner, payload.repo)
      db.storeBuildStart(job.data.id, payload.owner, payload.repo,
          payload.buildKey, payload.buildNumber)
    }

    if (job.data.notification === 'buildCompleted') {
      console.dir(payload)
      db.storeBuildComplete(job.data.id)
    }

    if (job.data.notification === 'taskStarted') {
      db.storeTaskStart(payload.taskID, payload.buildID, payload.task.id,
          payload.status, payload.stats.queuedAt)
      db.storeTaskDetails(payload.taskID, payload)
    }

    if (job.data.notification === 'taskUpdated') {
      db.storeTaskUpdate(payload.taskID, payload.status, payload.stats.startedAt,
          payload.worker.node)
      db.storeTaskDetailsUpdates(payload.taskID, payload)
    }

    if (job.data.notification === 'taskCompleted') {
      db.storeTaskCompleted(payload.taskID, payload.status, payload.stats.finishedAt,
          payload.stats.completedAt, payload.result.conclusion)
      db.storeTaskDetailsUpdates(payload.taskID, payload)
    }
  })
}

module.exports.start = start
