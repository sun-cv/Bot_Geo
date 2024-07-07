// Database
const { db } = require('../../../../../../database/utils/databaseIndex');

async function getUserAccountsTotal(userId) {

	let userAccountTotal;

	try {

		userAccountTotal = await db.get('SELECT accounts FROM member WHERE user_id = ?', userId);

		if (userAccountTotal === undefined) {
			return { accounts: 0 };
		}

		return userAccountTotal;
	}
	catch (error) {
		console.error('Error detected in getUserAccounts');
		throw error;
	}
}

module.exports = {
	getUserAccountsTotal,
	ignoreLoading: true,
};