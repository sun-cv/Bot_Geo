const { db } = require('../../../../database/database');
const { tasks } = require('../../../tasks/index');


async function loadTasksToDatabase() {

	try {

		let query;

		// Load all tasks from the database
		const dbTasks = await db.all('SELECT name FROM tasks');

		// Convert the tasks array to a set for faster lookup
		const taskSet = new Set(Object.keys(tasks));

		// Remove tasks from the database that are not in the index
		for (const dbTask of dbTasks) {
			if (!taskSet.has(dbTask.name)) {
				await db.run('DELETE FROM tasks WHERE name = ?', dbTask.name);
			}
		}

		for (const taskName in tasks) {
			if (Object.hasOwnProperty.call(tasks, taskName)) {
				const task = tasks[taskName];
				const taskLog = await db.get('SELECT * FROM tasks WHERE name = ?', task.name);

				if (taskLog === undefined) {
					query = 'INSERT INTO tasks (name, schedule, arguments, description, filepath, updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
					const values = [task.name, task.schedule, task.arguments, task.description, task.filepath, task.updated_at, task.created_at];
					await db.run(query, values);
				}
				else if (taskLog.updated_at !== task.updated_at) {
					query = 'UPDATE tasks SET schedule = ?, arguments = ?, description = ?, filepath = ?, updated_at = ? WHERE name = ?';
					const values = [task.schedule, task.arguments, task.description, task.filepath, task.updated_at, task.name];
					await db.run(query, values);
				}
			}
		}

		console.log('Tasks loaded.');
	}
	catch (error) {
		console.log('Error detected in loadTasks', error);
	}
}

module.exports = {
	loadTasksToDatabase,
};