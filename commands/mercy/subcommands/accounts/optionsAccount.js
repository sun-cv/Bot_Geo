const { sendFollowUpDelete } = require('../../../../utils');
const { initializeUserMercy } = require('../../functions/account/initializeUserMercy');
const { mercyBackgroundOptions } = require('../options/mercyBackground');


async function optionsAccountCommand(interaction) {


	try {

		const account = await initializeUserMercy(interaction);
		if (!account) return;

		if (interaction.options._hoistedOptions.length <= 1) {
			await sendFollowUpDelete(interaction, 'No option was selected. Please try again.');
		}

		const optionBackground = interaction.options.getBoolean('background');

		if (optionBackground) await mercyBackgroundOptions(interaction, account);


	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	optionsAccountCommand,
};
