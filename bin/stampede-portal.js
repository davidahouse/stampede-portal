#!/usr/bin/env node
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

const web = require('../lib/web')
const notifications = require('../lib/notifications')

require('pkginfo')(module)
const cache = require('stampede-cache')

const conf = require('rc')('mario', {
  // defaults
  redisHost: 'localhost',
  redisPort: 6379,
  redisPassword: null,
  webPort: 7744,
  notificationQueue: 'stampede-portal',
})

clear()
console.log(chalk.red(figlet.textSync('stampede-portal', {horizontalLayout: 'full'})))
console.log(chalk.yellow(module.exports.version))
console.log(chalk.red('Redis Host: ' + conf.redisHost))
console.log(chalk.red('Redis Port: ' + conf.redisPort))
console.log(chalk.red('Web Port: ' + conf.webPort))

// Initialize our cache
cache.startCache(conf)
notifications.start(conf)
web.startRESTApi(conf, cache)
