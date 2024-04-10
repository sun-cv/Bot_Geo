const { newTimestamp } = require('../../../utils/functions/timeKeeping/newTimestamp');
const { addRoleToUser } = require('../../../utils/functions/utility/addRoleToUser');
const { tracerResponseTime } = require('../functions');
const { logToConsole } = require('../logToConsole/logToConsole');
const { writeToDatabase } = require('../logToDatabase/writeToDatabase');
const { updateDatabase } = require('../logToDatabase/updateDatabase');
const { updateProperties, updateLogTask } = require('./logValues');


async function finalizeCommand(output) {

	try {

		if (this.interaction.discord.isAutocomplete()) return;

		if (this.command.role) addRoleToUser.call(this);

		await updateProperties.call(this, 'command', { output: output });
		await updateProperties.call(this, 'interaction', { finalAt: newTimestamp('unix') });
		await updateProperties.call(this, 'tracer', { responseTime: tracerResponseTime.call(this) });

		await writeToDatabase.call(this);
		await updateDatabase.call(this);

		logToConsole.call(this);

	}
	catch (error) {
		console.log('error detected in class Log: finalizeCommand - ', error);
	}
}


// finalize functions in finally {}
async function finalizeButton() {

	try {

		await updateProperties.call(this, 'interaction', { finalAt: newTimestamp('unix') });
		await updateProperties.call(this, 'tracer', { responseTime: tracerResponseTime.call(this) });

		await writeToDatabase.call(this);
		await updateDatabase.call(this);

		logToConsole.call(this);

	}
	catch (error) {
		console.log('error detected in class Log: finalizeButton - ', error);
	}
}


async function finalizeMessage(messageEvent) {

	messageEvent;
}

// finalize functions in finally {}
async function finalizeTask(taskInstance) {

	try {

		await updateLogTask.call(this, taskInstance);
		await writeToDatabase.call(this);

		logToConsole.call(this);

	}
	catch (error) {
		console.log('error detected in class Log: finalizeTask - ', error);
	}
}


module.exports = {
	finalizeCommand,
	finalizeButton,
	finalizeMessage,
	finalizeTask,
};