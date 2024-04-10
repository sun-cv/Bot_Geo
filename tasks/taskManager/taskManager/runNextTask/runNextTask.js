const { taskErrorHandling } = require('../../../../utils');


async function runNextTask() {

	if (this.isTaskRunning || this.taskQueue.length === 0) {
		return;
	}

	this.isTaskRunning = true;
	const task = this.taskQueue.shift();
	await taskErrorHandling(task);
	this.isTaskRunning = false;

	// If there are still tasks in the queue, try to run the next one
	if (this.taskQueue.length > 0) {
		this.runNextTask().catch(error => {
			console.error('Error detected in recursive call to runNextTask', error);
		});
	}
}

module.exports = {
	runNextTask,
};