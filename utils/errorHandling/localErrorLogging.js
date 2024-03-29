// logError.js
const { logErrorToDatabase } = require('./logErrorToDatabase');
const { replacer } = require('./functions/bigIntReplacer');


async function localErrorLogging(error, interaction, event) {

	let errorLog;

	if (event === 'interaction') {
		if (interaction) {
			errorLog = {
				channel_id: interaction.channel.id,
				user_id: interaction.user.id,
				username: interaction.user.username,
				command: interaction.commandName,
				errorName: error.name,
				errorMessage: error.message,
				stackTrace: error.stack,
				interactionArgs: JSON.stringify([interaction], replacer) };
		}
		else {
			errorLog = {
				channel_id: 'Failed at interactionCreate',
				user_id: 'unknown',
				username: 'unknown',
				command: 'interaction',
				errorName: error.name,
				errorMessage: error.message,
				stackTrace: error.stack,
				interactionArgs: 'unknown' };
		}


		// Log the error to the terminal
		console.log(error);
		// Log error to the database
		await logErrorToDatabase(errorLog, event);
	}

	else if (event === 'button') {
		if (interaction) {

			errorLog = {
				channel_id: interaction.channel.id,
				user_id: interaction.user.id,
				username: interaction.user.username,
				command: 'button',
				errorName: error.name,
				errorMessage: error.message,
				stackTrace: error.stack,
				interactionArgs: JSON.stringify([interaction], replacer) };
		}
		else {
			errorLog = {
				channel_id: 'Failed at interactionCreate',
				user_id: 'unknown',
				username: 'unknown',
				command: 'button',
				errorName: error.name,
				errorMessage: error.message,
				stackTrace: error.stack,
				interactionArgs: 'unknown' };
		}
		// Log the error to the terminal
		console.log(error);
		// Log error to the database
		await logErrorToDatabase(errorLog, event);
	}

	else if (event === 'message') {
		errorLog = {
			channel_id: interaction.channel.id,
			user_id: interaction.author.id,
			username: interaction.author.username,
			content: interaction.content,
			errorName: error.name,
			errorMessage: error.message,
			stackTrace: error.stack,
		};

		// Log the error to the terminal
		console.log(error);
		// Log error to the database
		await logErrorToDatabase(errorLog, event);

	}

	else if (event === 'task') {
		const task = interaction;
		errorLog = {
			task: task.name,
			content: task.content,
			scheduled_time: task.schedule,
			errorName: error.name,
			errorMessage: error.message,
			stackTrace: error.stack,
		};
		// Log the error to the terminal
		console.log(error);
		// Log error to the database
		await logErrorToDatabase(errorLog, event);
	}
}


module.exports = { localErrorLogging };