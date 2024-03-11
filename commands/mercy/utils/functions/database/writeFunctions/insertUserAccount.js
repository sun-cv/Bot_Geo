// Database
const { db } = require('../../../../../../database/utils/databaseIndex');
const { newTimestamp } = require('../../../../../../utils/functions/timeKeeping/newTimestamp');


async function insertUserAccount(userId, username, account) {

	const timestamp = await newTimestamp();

	try {
		// Insert account into mercy_accounts
		await db.run('INSERT INTO mercy_accounts (user_id, username, account, registration_date) VALUES (?, ?, ?, ?)', [userId, username, account, timestamp]);
		// add +1 to user accounts
		await db.run('UPDATE user SET accounts = accounts + 1 WHERE user_id = ?', userId);
	}
	catch (error) {
		console.log('Error detected in InsertUserAccount');
		throw error;

	}
}


module.exports = {
	insertUserAccount,
};