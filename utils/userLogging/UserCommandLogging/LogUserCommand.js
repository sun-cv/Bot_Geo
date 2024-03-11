// logCommand.js
const { getUserId, getUsername, getChannelId, getMessageId } = require('../../functions/interactionIndex');
const { db } = require('../../../database/database');
const { constructFullCommand } = require('./constructFullCommand');
const { newTimestamp } = require('../../functions/timeKeeping/newTimestamp');


// Export object for execution logging
const commandLog = {
	category: '',
	output: '',
	status: 'denied',
};

async function logUserCommand(interaction, log) {

	// Define constants
	const messageId = getMessageId(interaction);
	const channelId = getChannelId(interaction);
	const userId = getUserId(interaction);
	const username = getUsername(interaction);
	const category = log.category;
	const command = await constructFullCommand(interaction);
	const localOutput = log.output;
	const status = log.status;

	let errorName;
	if (log.error) {
		errorName = log.error.name;
	}
	else {
		errorName = 'none';
	}

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

	// Log
	console.log(`${username} used ${command}`);


}

module.exports = { logUserCommand, commandLog };

