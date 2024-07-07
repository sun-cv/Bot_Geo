const { db } = require('../../../../database/database');

async function deleteAccountData(account) {

	try {

		await db.run('DELETE FROM mercy_tracker_accounts WHERE id = ? AND member = ? AND name = ?', [account.id, account.member, account.name]);
		await db.run('DELETE FROM mercy_tracker_data WHERE id = ? AND member = ? AND name = ?', [account.id, account.member, account.name]);

	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	deleteAccountData,
};