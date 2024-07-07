const { addAccount } = require('../functions/addAccount');
const { checkAccountLimit } = require('../functions/checkAccountLimit');
const { isAccount } = require('../functions/isAccount');


async function addAccountCommand(interaction) {
	try {

		const accountToAdd = interaction.options.getString('name');

		if (await isAccount(interaction, accountToAdd)) {
			interaction.editReply({ content: 'This account already exists.', ephemeral: true });
			return;
		}

		if (await checkAccountLimit(interaction)) {
			interaction.editReply({ content: 'You\'ve reached the maximum of 10 accounts', ephemeral: true });
			return;
		}

		await addAccount(interaction, accountToAdd);

		interaction.editReply({ content: `${accountToAdd} was successfully added. Check /account options for customization.`, ephmeral: true });
	}
	catch (error) {
		console.log(error);
	}


}

module.exports = {
	addAccountCommand,
};