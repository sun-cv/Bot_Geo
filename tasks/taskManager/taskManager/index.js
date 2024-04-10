const { loadTasksToDatabase } = require('./loadTasks/loadTasksToDb');
const { loadTasksFromDatabase } = require('./loadTasks/loadTasksFromDb');
const { callSetupTasks } = require('./loadTasks/callSetupTasks');
const { runNextTask } = require('./runNextTask/runNextTask');
const { setupTasks } = require('./setupTasks/setupTasks');


module.exports = {
	loadTasksToDatabase,
	loadTasksFromDatabase,
	callSetupTasks,
	setupTasks,
	runNextTask,
};