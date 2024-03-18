// Database
const { db } = require('../../database/utils/databaseIndex.js');


async function updateAccountLastActive(userId, account) {

	try {

		const now = new Date().toISOString();

		await db.run('UPDATE mercy_accounts SET last_active = ? WHERE user_id = ? AND account = ?', [now, userId, account]);

	}
	catch (error) {
		console.log('Error in updateAccountLastActive');
		throw error;
	}
}
module.exports = {
	updateAccountLastActive,
};