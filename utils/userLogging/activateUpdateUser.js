// Database
const { db } = require('../../database/database');
const { transaction } = require('../../database/utils/constants/transactions/transactionStatus');
const { beginTransaction } = require('../../database/utils/functions/transactions/begin');
const { commitTransaction } = require('../../database/utils/functions/transactions/commit');
const { rollbackTransaction } = require('../../database/utils/functions/transactions/rollback');
const { newTimestamp } = require('../functions/timeKeeping/newTimestamp');


async function activateUpdateUser(userId, username) {

	await beginTransaction();

	const timestamp = await newTimestamp();

	try {

		// get userId from database
		const existing = await db.get('SELECT * FROM user WHERE user_id = ?', userId);

		// If user does not exist - insert
		if (!existing) {

			await db.run('INSERT INTO user (user_id, username, last_active, registration_date) VALUES (?, ?, ?, ?)', [userId, username, timestamp, timestamp]);

			// COMMIT
			await commitTransaction();

			console.log(`Added user ${username} to database succesfully.`);

		}
		else if (existing) {
			db.run('UPDATE user SET last_active = ? WHERE user_id = ?', [timestamp, userId]);

			await commitTransaction();
		}
		else {
			await rollbackTransaction();
		}
	}
	catch (error) {
		if (transaction.status) {
			await rollbackTransaction();
		}
		console.log('Error detected in ensureUserExists');
		throw error;
	}

}

module.exports = {
	activateUpdateUser,
};