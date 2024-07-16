const { db } = require('../../../../database/database');
const { sendFollowUpDelete } = require('../../../../Ιndex/utilities');


async function getAccount(interaction) {

	try {

		const input = interaction.options.getString('account');

		const accounts = await getMemberAccounts(interaction);

		const account = input ?
			accounts.find(accountObj => accountObj.name === input)
			:
			accounts.find(defaultObj => defaultObj.main === true);

		if (!account) await sendFollowUpDelete(interaction, 'Account was not found - please try again.');
		if (!account) return;

		if (account.data) account.data = JSON.parse(account.data);
		if (account.template) {
			account.template = JSON.parse(account.template);
		}

		return account;
	}
	catch (error) {
		console.log(error);
	}
}

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
	getAccount,
	getMemberAccounts,
};