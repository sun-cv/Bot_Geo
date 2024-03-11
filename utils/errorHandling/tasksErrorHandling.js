// Error handler
const { localErrorLogging } = require('./localErrorLogging');

const tasksErrorLog = {};

async function taskErrorHandling(task) {
	try {

		await task.execute();

	}
	catch (error) {

		const event = 'task';

		// Pass to local define and logging
		localErrorLogging(error, task, event);
		// Send a message to the user

	}
}

module.exports = {
	taskErrorHandling,
	tasksErrorLog };