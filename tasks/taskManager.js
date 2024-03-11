// Database
const { db } = require('../database/database');
// Cron
const cron = require('node-cron');
const { nextExecutionTime } = require('./timeKeeping/nextExecutionTime');
const { lastExecutionTime } = require('./timeKeeping/lastExecutionTime');
const { loadTasksToDatabase } = require('.');
const { taskErrorHandling } = require('../utils/errorHandling/tasksErrorHandling');


class TaskManager {
	constructor(client) {
		this.tasks = [];
		this.client = client;
		this.taskQueue = [];
		this.isTaskRunning = false;
	}

	async loadTasks() {
		try {

			await loadTasksToDatabase();

			const tasksFromDatabase = await db.all('SELECT * FROM tasks ORDER BY id');

			this.tasks = tasksFromDatabase;
			console.log('Schedule tasks..');
			this.tasks.forEach((task) => {
				this.setupTasks(task);

			});
		}
		catch (error) {
			console.log('Error detected in loadTasks.');
			throw error;
		}
	}

	async setupTasks(task) {
		try {
			// Import tasks
			let module;
			// Pass arguments

			const argument = {
				client: this.client,
			};
			if (task.filepath === null) {
				module = await import(`./tasks/${task.name}.js`);
			}
			else {
				module = await import(`./tasks/${task.filepath}/${task.name}.js`);
			}
			const runTask = module[task.name];
			const interval = await nextExecutionTime(task.schedule);

			// Logging
			console.log(`Scheduled ${task.name} successfully: next execution time: ${interval}`);

			cron.schedule(task.schedule, async () => {
				// Calculate intervalLive before pushing the task to the queue
				const intervalLive = await lastExecutionTime();

				// Add the task to the queue
				this.taskQueue.push({
					execute: async () => {
						console.log(`Running ${task.name}..`);

						if (task.arguments !== 'none') {
							await runTask(argument[task.arguments]);
						}
						else {
							await runTask();
						}
						const updatedInterval = nextExecutionTime(task.schedule);
						console.log(`next execution time: ${updatedInterval}\n`);
					},
					name: task.name,
					schedule: intervalLive,
					content: task.description,
					// other properties here as needed
				});

				// Try to run the next task in the queue
				this.runNextTask();
			});
		}

		catch (error) {
			console.log('Error detected in setupTasks');
			throw error;
		}
	}

	async runNextTask() {
		if (this.isTaskRunning || this.taskQueue.length === 0) {
			return;
		}

		this.isTaskRunning = true;
		const task = this.taskQueue.shift();
		await taskErrorHandling (task);
		this.isTaskRunning = false;

		// If there are still tasks in the queue, try to run the next one
		if (this.taskQueue.length > 0) {
			this.runNextTask().catch(error => {
				console.error('Error detected in recursive call to runNextTask', error);
				// Handle the error appropriately here
			});
		}
	}

	async updateTasks(task) {

		try {

			const nextExecution = nextExecutionTime(task.schedule);
			const lastExecution = await lastExecutionTime();

			await db.run('UPDATE tasks SET last_execution = ?, next_execution = ? WHERE name = ?', lastExecution, nextExecution, task.name);

		}
		catch (error) {

			console.log('Error detected in updateTasks');
			throw error;

		}

	}
}


/**
 * WIP
 */


module.exports = {
	TaskManager,
};