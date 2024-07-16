const { getMemberAccounts } = require('../../functions/account/getAccount');
const { initializeUserMercy } = require('../../functions/account/initializeUserMercy');

async function listAccountsCommand(interaction) {
	try {

		await initializeUserMercy(interaction);

		const accounts = await getMemberAccounts(interaction);
		accounts.sort((a, b) => (a.main === b.main) ? 0 : a.main ? -1 : 1);

		let output = 'Your currently registered accounts are:\n\n';

		accounts.forEach(account => {
			output += `${account.name}${account.main === true ? ' - default' : ''}\n`;
		});

		await interaction.followUp({ content: output, ephemeral: true });

	}
	catch (error) {
		console.log(error);
	}

}

module.exports = {
	listAccountsCommand,
};