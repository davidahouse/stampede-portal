"use strict";

const chalk = require("chalk");
const Queue = require("bull");

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
      password: conf.redisPassword
    }
  };
  const q = new Queue("stampede-" + conf.notificationQueue, redisConfig);
  q.process(function(job) {
    console.log(
      chalk.green(job.data.notification) +
        " [" +
        chalk.yellow(job.data.id) +
        "]"
    );
    processJob(job, db);
  });
}

async function processJob(job, db) {
  const payload = job.data.payload;
  if (job.data.notification === "buildStarted") {
    try {
      await db.storeRepository(payload.owner, payload.repo);
      await db.storeBuildStart(
        job.data.id,
        payload.owner,
        payload.repo,
        payload.buildKey,
        payload.buildNumber
      );
    } catch (e) {
      console.log(chalk.red("Error storing build started details: " + e));
    }
  }

  if (job.data.notification === "buildCompleted") {
    console.dir(payload);
    try {
      await db.storeBuildComplete(job.data.id);
    } catch (e) {
      console.log(chalk.red("Error storing build completed details: " + e));
    }
  }

  if (job.data.notification === "taskStarted") {
    try {
      await db.storeTaskStart(
        payload.taskID,
        payload.buildID,
        payload.task.id,
        payload.status,
        payload.stats.queuedAt
      );
      await db.storeTaskDetails(payload.taskID, payload);
    } catch (e) {
      console.log(chalk.red("Error Storing task start details: " + e));
    }
  }

  if (job.data.notification === "taskUpdated") {
    try {
      await db.storeTaskUpdate(
        payload.taskID,
        payload.status,
        payload.stats.startedAt,
        payload.worker.node
      );
      await db.storeTaskDetailsUpdate(payload.taskID, payload);
    } catch (e) {
      console.log(chalk.red("Error storing task updated details: " + e));
    }
  }

  if (job.data.notification === "taskCompleted") {
    try {
      await db.storeTaskCompleted(
        payload.taskID,
        payload.status,
        payload.stats.finishedAt,
        payload.stats.completedAt,
        payload.result.conclusion
      );
      await db.storeTaskDetailsUpdate(payload.taskID, payload);
    } catch (e) {
      console.log(chalk.red("Error storing task completed details: " + e));
    }
  }
}

module.exports.start = start;
