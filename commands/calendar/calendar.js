const { CommandInteraction, SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { admin } = require('../../config.json');

async function plariumCalendar(interaction = new CommandInteraction) {

	const month = '7';
	const day = '9';

	const lastUpdate = `${month}/${day}`;
	const lastScreenshot = `${month}-${day}`;

	const shareCalendar = interaction.options.getString('share') === 'true';

	const filePath = path.join(__dirname, 'calendars', `${lastScreenshot}.png`);

	try {

		interaction.editReply({ content: `last updated on: ${lastUpdate}\n\n Ping <@${admin}> if out of date`, files: [{ attachment: filePath, name: 'latestCalendar.png' }], ephemeral: !shareCalendar });
		if (shareCalendar) setTimeout(() => { interaction.deleteReply(); }, 1000 * 60 * 5);

	}

	catch (error) {
		console.log(error);
	}
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('calendar')
		.setDescription('Provides a screenshot of the Plarium Play event calendar.')
		.addStringOption(option =>
			option.setName('share')
				.setDescription('Share the calendar in channel')
				.addChoices(
					{ name: 'true', value: 'true' })),


	execute: plariumCalendar,
	command: true,
	defer: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	cooldown: 120,
	subCommand: 'shareCalendar',
	subCooldown: 300,
	trace: true,
};