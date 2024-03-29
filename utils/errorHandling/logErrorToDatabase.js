// Database
const { db } = require('../../database/utils/databaseIndex');

const { newTimestamp } = require('../functions/timeKeeping/newTimestamp');


async function logErrorToDatabase(errorLog, event) {

	try {
		if (event === 'interaction') {

			// Get current date and time
			const time = await newTimestamp();
			const timestamp = new Date().toISOString();

			// Define error log info
			const { channel_id, user_id, username, command, errorName, errorMessage, stackTrace, interactionArgs } = errorLog;

			// Define query
			const query = `
        INSERT INTO error_log
        (channel_id, user_id, username, command, error_name, error_message, stack_trace, interaction_args, time, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
			// Define values
			const values = [channel_id, user_id, username, command, errorName, errorMessage, stackTrace, interactionArgs, time, timestamp];
			// Run
			await db.run(query, values);

			// Increment user error count
			if (user_id) {
				db.run('UPDATE user SET error_count = error_count + 1 WHERE user_id = ?', user_id);
			}


			return;
		}

		if (event === 'button') {

			// Get current date and time
			const time = await newTimestamp();
			const timestamp = new Date().toISOString();

			// Define error log info
			const { channel_id, user_id, username, command, errorName, errorMessage, stackTrace, interactionArgs } = errorLog;

			// Define query
			const query = `
        INSERT INTO error_log
        (channel_id, user_id, username, command, error_name, error_message, stack_trace, interaction_args, time, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
			// Define values
			const values = [channel_id, user_id, username, command, errorName, errorMessage, stackTrace, interactionArgs, time, timestamp];
			// Run
			await db.run(query, values);

			// Increment user error count
			if (user_id) {
				db.run('UPDATE user SET error_count = error_count + 1 WHERE user_id = ?', user_id);
			}


			return;
		}

		else if (event === 'message') {

			// Get current date and time
			const time = await newTimestamp();
			const timestamp = new Date().toISOString();
			// Define error log info
			const { channel_id, user_id, username, content, errorName, errorMessage, stackTrace } = errorLog;

			// Define query
			const query = `
		INSERT INTO message_error_log
		(channel_id, user_id, username, content, error_name, error_message, stack_trace, time, timestamp)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;
			// Define values
			const values = [channel_id, user_id, username, content, errorName, errorMessage, stackTrace, time, timestamp];
			// Run
			await db.run(query, values);

			// Increment user error count
			if (user_id) {
				await db.run('UPDATE user SET error_count = error_count + 1 WHERE user_id = ?', user_id);
			}

		}
		else if (event === 'task') {

			// Get current date and time
			const time = await newTimestamp();
			const timestamp = new Date().toISOString();
			// Define error log info
			const { task, content, scheduled_time, errorName, errorMessage, stackTrace } = errorLog;

			// Define query
			const query = `
					INSERT INTO tasks_error_log
					(task, content, scheduled_time, error_name, error_message, stack_trace, time, timestamp)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?)
					`;
			// Define values
			const values = [task, content, scheduled_time, errorName, errorMessage, stackTrace, time, timestamp];
			// Run
			await db.run(query, values);

		}
	}
	catch (error) {

		console.log('Error detected in logErrorToDatabse.');
		throw error;
	}
}


module.exports = { logErrorToDatabase };