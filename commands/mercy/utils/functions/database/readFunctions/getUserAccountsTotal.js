// Database
const { db } = require('../../../../../../database/utils/databaseIndex');


async function getUserAccountsTotal(userId) {
	try {

		const userAccountTotal = await db.get('SELECT accounts FROM member WHERE user_id = ?', userId);

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