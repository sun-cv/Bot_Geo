const { Task } = require('../../task/task');

async function callSetupTasks() {

	try {


		if (this.manualTask.length === 1) {
			console.log(`Run manual task.. ${this.manualTask[0].name}`);
			this.manualTask.forEach((taskData) => {
				const task = new Task(taskData);
				this.setupTasks(task);

			});
		}
		else {

			console.log('Schedule tasks..');

			this.tasks.forEach((taskData) => {
				const task = new Task(taskData);
				this.setupTasks(task);

			});
		}
	}

	catch (error) {
		console.log('error detected in class TaskManager: setupTasks', error);
	}
}

module.exports = {
	callSetupTasks,
};