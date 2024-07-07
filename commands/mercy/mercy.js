const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { generateMercyImage } = require('./functions/mercy/generateMercyImage');
const { initializeUserMercy } = require('./functions/account/initializeUserMercy');


async function mercyCommand(interaction = new CommandInteraction(), log) {

	await log.initiateCommand({ name: 'mercy', category: 'mercy tracker', role: 'Mercy' });

	try {

		const account = await initializeUserMercy(interaction);
		if (!account) return;

		const image = await generateMercyImage(account);
		if (!image) throw new Error('no image generated');

		const share = interaction.options.getString('share');
		interaction.editReply({ files: [{ attachment: image, name: 'mercy.png' }], ephemeral: share });

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
		.setName('mercy')
		.setDescription('Check your mercy count')
		.addStringOption(option =>
			option.setName('account')
				.setDescription('Alt account')
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('share')
				.setDescription('Share your mercy count')
				.addChoices(
					{ name: 'true', value: 'true' })),

	execute: mercyCommand,
	command: true,
	defer: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	trace: true,
	cooldownCount: 0,
	subCommand: 'shareMercy',
	subCooldownCount: 120,
};