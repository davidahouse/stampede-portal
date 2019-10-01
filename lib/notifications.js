'use strict'

const chalk = require('chalk')
const Queue = require('bull')

/**
 * start
 * @param {*} conf
 */
async function start(conf) {
  const redisConfig = {
    redis: {
      port: conf.redisPort,
      host: conf.redisHost,
      password: conf.redisPassword,
    },
  }
  const q = new Queue(conf.notificationQueue, redisConfig)
  q.process(function(job) {
    console.log(chalk.green(job.data.notification) + ' [' + chalk.yellow(job.data.id) + ']')
  })
}

module.exports.start = start
