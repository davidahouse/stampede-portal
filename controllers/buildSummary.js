/**
 * handle buildSummary
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const success = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const failure = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  const builds = await db.recentBuilds()
  const recentBuilds = builds.rows
  for (let index = 0; index < recentBuilds.length; index++) {
    console.dir(recentBuilds[index])
    console.log(recentBuilds[index].completedat)
    const ageInMs = Date.now() - recentBuilds[index].completedat
    console.log(ageInMs)
    const ageInHours = Math.round(ageInMs / 1000 / 60 / 60)
    console.log(ageInHours)
    if (recentBuilds[index].status === 'completed') {
      success[success.length - 1 - ageInHours] = success[success.length - 1 - ageInHours] + 1
    } else {
      failure[failure.length - 1 - ageInHours] = failure[failure.length - 1 - ageInHours] + 1
    }
  }

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
