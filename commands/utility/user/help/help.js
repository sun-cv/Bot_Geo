const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { logUserCommand, commandLog } = require('../../../../utils/index');
const { sendHelpHome } = require('./index');


async function botHelp(interaction = new CommandInteraction, trace) {

	try {

		await sendHelpHome(interaction);

		// Logging
		commandLog.status = 'success';
		return;

	}
	catch (error) {
		console.log('error detected in bot help.');
		// Logging
		commandLog.status = 'failed';
		commandLog.error = error;

		throw error;
	}
	finally {
		// Logging
		commandLog.category = 'Utility';
		commandLog.output = 'none';
		logUserCommand(interaction, commandLog, trace);
	}


}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('One stop shop for help!'),

	execute: botHelp,
	command: true,
	deferReply: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,

};