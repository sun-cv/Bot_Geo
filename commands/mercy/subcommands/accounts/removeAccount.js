const { initializeUserMercy } = require('../../functions/account/initializeUserMercy');
const { deleteAccountData } = require('../functions/deleteAccountData');

async function removeAccountCommand(interaction) {

	try {

		const account = await initializeUserMercy(interaction);
		if (!account) return;

		const confirm = interaction.options.getString('confirm') === 'true' ? true : false;

		if (!confirm) {
			interaction.editReply({ content: 'Account deletion canceled' });
			return;
		}

		await deleteAccountData(account);

		interaction.editReply({ content: `${account.name} successfully deleted.`, ephemeral: true });

	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	removeAccountCommand,
};