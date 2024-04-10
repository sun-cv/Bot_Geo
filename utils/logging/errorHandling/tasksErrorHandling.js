const tasksErrorLog = {};

async function taskErrorHandling(task) {
	try {

		await task.execute();

	}
	catch (error) {
		console.log('error detected in task error handling', error);
	}
}

module.exports = {
	taskErrorHandling,
	tasksErrorLog };