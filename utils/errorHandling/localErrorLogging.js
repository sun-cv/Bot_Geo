// logError.js
const { logErrorToDatabase } = require('./logErrorToDatabase');
const { replacer } = require('./functions/bigIntReplacer');


async function localErrorLogging(error, interaction, event) {


	if (event === 'interaction') {
		const errorLog = {
			channel_id: interaction.channel.id,
			user_id: interaction.user.id,
			username: interaction.user.username,
			command: interaction.commandName,
			errorName: error.name,
			errorMessage: error.message,
			stackTrace: error.stack,
			interactionArgs: JSON.stringify([interaction], replacer),
		};


		// Log the error to the terminal
		console.log(error);
		// Log error to the database
		await logErrorToDatabase(errorLog, event);
	}

	else if (event === 'message') {
		const errorLog = {
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
		const errorLog = {
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