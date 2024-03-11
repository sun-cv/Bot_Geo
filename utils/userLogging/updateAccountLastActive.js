// Database
const { beginTransaction, transaction, rollbackTransaction, commitTransaction, db } = require('../../database/utils/databaseIndex.js');


async function updateAccountLastActive(userId, account) {

	try {
		// WRITES begin transaction
		await beginTransaction();

		const now = new Date().toISOString();

		await db.run('UPDATE mercy_accounts SET last_active = ? WHERE user_id = ? AND account = ?', [now, userId, account]);

		// COMMIT
		await commitTransaction();
	}
	catch (error) {
		if (transaction.status) {
			rollbackTransaction();
		}
		console.log('Error in updateAccountLastActive');
		throw error;
	}
}
module.exports = {
	updateAccountLastActive,
};