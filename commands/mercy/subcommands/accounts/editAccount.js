const { initializeUserMercy } = require('../../functions/account/initializeUserMercy');
const { changeAccountName } = require('../functions/changeAccountName');
const { changeAccountDefault } = require('../functions/changeAccountDefault');
const { sendOutputs } = require('../functions/sendOutputs');


async function editAccountCommand(interaction) {
	try {

		const outputs = [];
		const account = await initializeUserMercy(interaction);

		const changeName = (interaction.options.getString('name')) ? true : false;
		const changeDefault = (interaction.options.getString('default')) ? true : false;

		if (changeName) {
			await changeAccountName(interaction, account, outputs);
		}
		if (changeDefault) {
			await changeAccountDefault(interaction, account, outputs);
		}

		await sendOutputs(interaction, outputs);

	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	editAccountCommand,
};


/**
 *
 * Edit name
 * Edit default
 *
 *
 *
 *
 *
 */