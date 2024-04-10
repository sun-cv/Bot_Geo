// Database
const { db } = require('../../database');
const { getUserId, getUsername } = require('../../../utils/functions/interactionIndex');
const { newTimestamp } = require('../../../utils/functions/timeKeeping/newTimestamp');


async function activateUpdateUser(interaction) {

	const userId = getUserId(interaction);
	const username = getUsername(interaction);

	const timestamp = await newTimestamp();

	try {

		// get userId from database
		const existing = await db.get('SELECT * FROM user WHERE user_id = ?', userId);

		// If user does not exist - insert
		if (!existing) {

			await db.run('INSERT INTO user (user_id, username, last_active, registration_date) VALUES (?, ?, ?, ?)', [userId, username, timestamp, timestamp]);

			console.log(`Added user ${username} to database succesfully.`);
		}
		else {
			db.run('UPDATE user SET last_active = ? WHERE user_id = ?', [timestamp, userId]);
		}
	}
	catch (error) {
		console.log('Error detected in ensureUserExists');
		throw error;
	}

}

module.exports = {
	activateUpdateUser,
};