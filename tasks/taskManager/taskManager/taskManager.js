const { loadTasksToDatabase, loadTasksFromDatabase, callSetupTasks, setupTasks } = require('./index');


class TaskManager {
	constructor(client) {
		this.tasks = [];
		this.client = client;
		this.taskQueue = [];
		this.failedTasksQueue = [];
		this.isTaskRunning = false;
		this.manualTask = [];
	}

	async loadTasks(manualTask) {
		try {

			await loadTasksToDatabase();
			await loadTasksFromDatabase.call(this, manualTask);
			await callSetupTasks.call(this);

		}
		catch (error) {
			console.log('Error detected in class TaskManager: loadTasks', error);
		}
	}


	async setupTasks(task) {
		try {
			// calls runNextTask
			await setupTasks.call(this, task);
		}
		catch (error) {
			console.log('Error detected in class TaskManager: setupTasks', error);
		}
	}


	async runNextTask() {
		let task;
		try {
			if (this.isTaskRunning || (this.taskQueue.length === 0 && this.failedTasksQueue.length === 0)) {
				return;
			}
			this.isTaskRunning = true;
			task = this.taskQueue.length > 0 ? this.taskQueue.shift() : this.failedTasksQueue.shift();
			await task.execute();
			this.isTaskRunning = false;

			// If there are still tasks in the queue, try to run the next one
			if (this.taskQueue.length > 0 || this.failedTasksQueue.length > 0) {
				this.runNextTask().catch(error => {
					console.error('Error detected in recursive call to runNextTask', error);
				});
			}
		}
		catch (error) {
			console.log('Error detected in class LoadTasks: runNextTask', error);
			this.isTaskRunning = false;
			if (task.retryCount < 3) {task.retryCount++;}
			this.failedTasksQueue.push(task);
		}
	}


	async runFailedTasks() {
		while (this.failedTasksQueue.length > 0) {
			await this.runNextTask();
		}
	}

}

module.exports = {
	TaskManager,
};