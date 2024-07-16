const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { generateMercyImage } = require('./functions/mercy/generateMercyImage');
const { initializeUserMercy } = require('./functions/account/initializeUserMercy');

async function mercyCommand(interaction = new CommandInteraction()) {
	try {

		const account = await initializeUserMercy(interaction);
		if (!account) return;

		const image = await generateMercyImage(account);
		if (!image) throw new Error('no image generated');

		const share = interaction.options.getString('share') === 'true';
		interaction.editReply({ files: [{ attachment: image, name: 'mercy.png' }], ephemeral: share });

		if (share) setTimeout(() => { interaction.deleteReply(); }, 1000 * 60 * 5);

	}
	catch (error) {
		console.log(error);
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
	cooldown: 0,
	subCommand: 'shareMercy',
	subCooldown: 120,
};