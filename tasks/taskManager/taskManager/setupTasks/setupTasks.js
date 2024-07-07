const cron = require('node-cron');
const { nextExecutionTime } = require('../utils/nextExecutionTime');
const { lastExecutionTime } = require('../utils/lastExecutionTime');
const { newTimestamp } = require('../../../../utils');

async function setupTasks(task) {

	task.scheduledAt = newTimestamp();
	task.nextExecution = nextExecutionTime(task.schedule);

	await task.initiate();

	try {

		const argument = {
			client: this.client,
		};

		const filepath = task.filepath ? `${task.filepath}/` : '';
		const module = await import(`../../../tasks/${filepath}${task.name}.js`);

		const runTask = module[task.name];


		if (this.manualTask.length === 1) {
			task.startTime = newTimestamp('unix');
			task.lastExecution = lastExecutionTime();
			task.update();
			await runTask(task);
			task.nextExecution = nextExecutionTime(task.schedule);
			task.responseTime = (newTimestamp('unix') - task.startTime) + 'ms';
			task.finalize();
			return;
		}

		// Logging
		console.log(`Scheduled ${task.name} successfully: next execution time: ${task.nextExecution}`);

		cron.schedule(task.schedule, async () => {

			task.lastExecution = lastExecutionTime();

			// Add the task to the queue
			this.taskQueue.push({
				execute: async () => {
					try {

						task.startTime = newTimestamp('unix');
						task.update();
						console.log(`Running ${task.name}..`);

						if (task.arguments !== 'none') {
							await runTask(task, argument[task.arguments]);
						}
						else {
							await runTask(task);
						}

						task.nextExecution = nextExecutionTime(task.schedule);
						task.responseTime = (newTimestamp('unix') - task.startTime) + 'ms';

						task.finalize();
					}
					catch (error) {
						console.log(`error in ${task.name} at execution`);
					}
				},
			});

			// Try to run the next task in the queue
			this.runNextTask();
		});
	}
	catch (error) {
		console.log('error detected in class TaskManager: setupTasks', error);
	}


}

module.exports = {
	setupTasks,
};