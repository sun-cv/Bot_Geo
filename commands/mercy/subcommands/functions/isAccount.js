const { db } = require('../../../../database/database');

async function isAccount(interaction, name) {


	try {

		const existingAccounts = await db.all('SELECT * FROM mercy_tracker_accounts WHERE id = ?', [interaction.member.user.id]);

		const existingAccount = existingAccounts.some(accountObj => accountObj.name === name);

		return existingAccount;

	}
	catch (error) {
		console.log(error);
	}

}

module.exports = {
	isAccount,
};