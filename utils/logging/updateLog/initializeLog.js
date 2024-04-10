const { writeToDatabase } = require('../logToDatabase/writeToDatabase');
const { updateLogInteraction, updateLogMember, updateLogCommand, updateLogButton, updateLogMessage, updateLogTask, updateProperties, updateLogTracer } = require('./logValues');


async function startLog(interaction) {
	try {
		if (interaction.isAutocomplete()) return;

		await updateLogInteraction.call(this, interaction);


	}
	catch (error) {
		console.log('error detected in class Log: startLog - ', error);
	}
}


async function startCommandLog(update) {
	try {

		if (this.interaction.discord.isAutocomplete()) return;

		await updateLogMember.call(this);
		await updateLogCommand.call(this);
		await updateLogTracer.call(this);
		await updateProperties.call(this, 'command', update);

	}
	catch (error) {
		console.log('error detected in class Log: startCommandLog - ', error);
	}
}

async function startMessageLog(update) {

	try {

		updateLogMember.call(this, update);
		updateLogMessage.call(this, update);

	}
	catch (error) {
		console.log('error detected in class Log: startMessageLog - ', error);
	}
}

async function startButtonLog(category) {

	try {

		await updateLogMember.call(this);
		await updateLogButton.call(this);
		await updateLogTracer.call(this);
		await updateProperties.call(this, 'button', { category: category });

	}
	catch (error) {
		console.log('error detected in class Log: startButtonLog - ', error);
	}
}

async function startTaskLog(taskInstance) {

	try {
		await updateLogTask.call(this, taskInstance);

		await writeToDatabase.call(this);
	}
	catch (error) {
		console.log('error detected in class Log: startTaskLog - ', error);
	}
}

module.exports = {
	startLog,
	startCommandLog,
	startMessageLog,
	startButtonLog,
	startTaskLog,
};