// Database
const { db } = require('../../../../../../database/utils/databaseIndex');


async function getUserAccounts(userId) {
	try {

		const userAccounts = await db.all('SELECT * FROM mercy_accounts WHERE user_id = ?', userId);

		return userAccounts;
	}
	catch (error) {
		console.error('Error detected in getUserAccounts');
		throw error;
	}
}

module.exports = {
	getUserAccounts,
};

