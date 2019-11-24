/**
 * handle buildSummary
 * @param {*} req
 * @param {*} res
 * @param {*} cache
 * @param {*} db
 * @param {*} path
 */
async function handle(req, res, cache, db, path) {
  const success = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const failure = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  let timeFilter = "Last 8 hours";
  if (req.query.time != null) {
    timeFilter = req.query.time;
  }

  let repositoryFilter = "All";
  if (req.query.repository != null) {
    repositoryFilter = req.query.repository;
  }

  const repositoriesRows = await db.fetchRepositories();
  const repositories = [];
  repositories.push("All");
  for (let index = 0; index < repositoriesRows.rows.length; index++) {
    repositories.push(
      repositoriesRows.rows[index].owner +
        "/" +
        repositoriesRows.rows[index].repository
    );
  }

  const taskList = await cache.fetchTasks();
  const sortedTasks = taskList.sort();

  const graphs = [];
  for (let index = 0; index < sortedTasks.length; index++) {
    const tasks = await db.recentTasks(
      timeFilter,
      sortedTasks[0],
      repositoryFilter,
      "All",
      "Date DESC"
    );

    const taskLabels = [];
    const taskData = [];
    const taskColor = [];

    for (let tindex = 0; tindex < tasks.rows.length; tindex++) {
      if (
        tasks.rows[tindex].started_at != null &&
        tasks.rows[tindex].finished_at &&
        tasks.rows[tindex].conclusion
      ) {
        taskLabels.push(tasks.rows[tindex].task_id);
        if (tasks.rows[tindex].conclusion === "success") {
          taskColor.push("rgba(0, 255, 0, 0.6)");
        } else {
          taskColor.push("rgba(255, 0, 0, 0.6)");
        }
        taskData.push(
          (tasks.rows[tindex].finished_at - tasks.rows[tindex].started_at) /
            1000.0
        );
      }
    }

    let data = {
      labels: taskLabels,
      datasets: [
        {
          label: "Duration",
          data: taskData,
          backgroundColor: taskColor
        }
      ]
    };

    graphs.push({
      task: sortedTasks[index],
      data: data
    });
  }

  res.render(path + "monitor/taskSummary", {
    graphs: graphs,
    timeFilter: timeFilter,
    timeFilterList: ["Last 8 hours", "Today", "Yesterday"],
    repositoryFilter: repositoryFilter,
    repositoryList: repositories
  });
}

module.exports.handle = handle;