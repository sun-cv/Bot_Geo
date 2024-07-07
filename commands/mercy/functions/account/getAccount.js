const { sendFollowUpDelete } = require('../../../../utils');
const { getMemberAccounts } = require('./getMemberAccounts');


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

module.exports = {
	getAccount,
};

