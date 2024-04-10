// logCommand.js
const { getUserId, getUsername, getChannelId, getMessageId } = require('../../functions/interactionIndex');
const { db } = require('../../../database/database');
const { constructFullCommand } = require('./constructFullCommand');
const { newTimestamp } = require('../../functions/timeKeeping/newTimestamp');
const { userCommandTrace } = require('../../../events/utils/objects/userCommandTrace');
const { logColor } = require('../../functions/stylistic/logColor');


// Export object for execution logging
const commandLog = {
	category: '',
	output: '',
	status: 'denied',
};

async function logUserCommand(interaction, log, trace) {

	// Define constants
	const messageId = getMessageId(interaction);
	const channelId = getChannelId(interaction);
	const userId = getUserId(interaction);
	const username = getUsername(interaction);
	let command;
	if (interaction.isButton()) {
		command = interaction.customId;
	}
	else {
		command = constructFullCommand(interaction);
	}
	const {
		category = null,
		localOutput = null,
		status = null } = log;

	const statusColors = {
		success: 'green',
		failed: 'yellow',
		denied: 'red',
	};

	let errorName;
	if (log.error) {
		errorName = log.error.name;
	}
	else {
		errorName = 'none';
	}
	try {
		const time = await newTimestamp();
		const timestamp = new Date().toISOString();

		// Define entry
		const user_command_log = `INSERT INTO user_command_log
	(channel_id, message_id, user_id, username, category, command, output, status, error, time, timestamp) 
	VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`;
		// Define values
		const values = [channelId, messageId, userId, username, category, command, localOutput, status, errorName, time, timestamp];

		// Update user_command_log
		await db.run(user_command_log, values);

		// Update user command count
		await db.run('UPDATE user SET command_count = command_count + 1, last_command = ? WHERE user_id = ?', command, userId);

		const hour = await newTimestamp('hour');

		// Log
		if (trace) {
			const context = userCommandTrace.get(trace);

			console.log(await logColor([`${context.count} - ${context.time} > ${hour}: ${username} used ${command} - `, `${statusColors[log.status]}`, `${log.status}`]));
			userCommandTrace.delete(trace);
		}
		else if (interaction.isButton()) {
			const commandParts = command.split('home');
			const coloredCommand = commandParts.length > 1
				? [...commandParts.slice(0, -1), 'cyan', 'home', ...commandParts.slice(-1)]
				: [command];

			console.log(await logColor([`${hour}: ${username} is navigating `, ...coloredCommand]));
		}
		else {
			console.log(await logColor([`${hour}: ${username} used ${command} - `, `${statusColors[log.status]}`, `${log.status}`]));
		}
	}
	catch (error) {
		console.log('Error detected in logUserCommand');
		throw error;
	}
}

module.exports = { logUserCommand, commandLog };

