/**
 * handle buildSummary
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const success = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4]
  const failure = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3]

  // TODO: We need to query here for the builds

  // for (let index = 0; index < recentBuilds.length; index++) {
  //   const buildInfo = await redisClient.fetch('luigi-jenkins-build-' + recentBuilds[index])
  //   if (buildInfo != null && buildInfo.buildStatus != null && buildInfo.buildStatus.status != null) {
  //     const ageInMs = Date.now() - buildInfo.buildStatus.endTimeMillis
  //     const ageInHours = Math.round(ageInMs / 1000 / 60 / 60)
  //     if (buildInfo.buildStatus.status === 'SUCCESS') {
  //       success[success.length - 1 - ageInHours] = success[success.length - 1 - ageInHours] + 1
  //     } else {
  //       failure[failure.length - 1 - ageInHours] = failure[failure.length - 1 - ageInHours] + 1
  //     }
  //   }
  // }

  const data = {
    labels: ['11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
    datasets: [
      {label: 'Sucess', data: success, backgroundColor: 'rgba(0, 255, 0, 0.6)'},
      {label: 'Failed', data: failure, backgroundColor: 'rgba(255, 0, 0, 0.6)'},
    ],
  }
  res.render(path + 'buildSummary', {data: data})
}

module.exports.handle = handle
