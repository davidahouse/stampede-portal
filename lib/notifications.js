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
      db.storeRepository(payload.owner, payload.repository)
      db.storeBuildStart(payload.owner, payload.repository, payload.buildKey, payload.build)
    }

    if (job.data.notification === 'buildCompleted') {
      db.storeBuildComplete(payload.owner, payload.repository, payload.buildKey, payload.build)
    }

    if (job.data.notification === 'taskStarted') {
      db.storeTaskStart(payload.owner, payload.repository, payload.buildKey, payload.buildNumber,
          payload.task.id, payload.task.number, payload.status)
    }

    if (job.data.notification === 'taskUpdated') {
      db.storeTaskUpdate(payload.owner, payload.repository, payload.buildKey, payload.buildNumber,
          payload.task.id, payload.task.number, payload.status)
    }

    if (job.data.notification === 'taskCompleted') {
      db.storeTaskUpdate(payload.owner, payload.repository, payload.buildKey, payload.buildNumber,
          payload.task.id, payload.task.number, payload.status)
    }
  })
}

module.exports.start = start
