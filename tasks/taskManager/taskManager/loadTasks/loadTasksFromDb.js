const { db } = require('../../../../database/database');

async function loadTasksFromDatabase(manualTask) {

	let tasksFromDB;
	try {

		if (manualTask) {
			tasksFromDB = await db.all('SELECT * FROM tasks WHERE name = ? ORDER BY id', manualTask);
			this.manualTask.push(...tasksFromDB);
		}
		else {
			tasksFromDB = await db.all('SELECT * FROM tasks ORDER BY id');
			this.tasks.push(...tasksFromDB);
		}
	}
	catch (error) {
		console.log('error detected in class TaskManager: loadTasksFromDatabase', error);
	}
}

module.exports = {
	loadTasksFromDatabase,
};