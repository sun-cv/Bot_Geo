const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { sendHelpHome } = require('./index');


async function botHelp(interaction = new CommandInteraction, log) {

	await log.initiateCommand({ name: 'help', category: 'help' });

	try {

		await sendHelpHome(interaction, log);

	}
	catch (error) {
		log.errorHandling(error);
	}
	finally {
		log.finalizeCommand();
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('One stop shop for help!'),

	execute: botHelp,
	command: true,
	defer: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	trace: true,
};