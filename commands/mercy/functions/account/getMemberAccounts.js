const { db } = require('../../../../database/database');

async function getMemberAccounts(interaction) {
	try {
		const accounts = await db.all('SELECT * FROM mercy_tracker_accounts WHERE id = ?', interaction.member.user.id);

		for (const account of accounts) {
			account.main = account.main === '1' ? true : false;
		}

		return accounts;
	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	getMemberAccounts,
};