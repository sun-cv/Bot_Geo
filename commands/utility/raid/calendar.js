const { CommandInteraction, SlashCommandBuilder } = require('discord.js');


async function plariumCalendar(interaction = new CommandInteraction) {

	const month = '3';
	const day = '23';

	const lastUpdate = `${month}/${day}`;
	const lastScreenshot = `${month}-${day}`;

	let shareCalendar = false;

	const shareInputValue = interaction.options.getString('share');
	if (shareInputValue === 'true') { shareCalendar = true; }

	const filePath = `D:/Projects/Bot_Geo/commands/utility/raid/calenderScreenshots/${lastScreenshot}.png`;

	interaction.editReply({ content: `last updated on: ${lastUpdate}\n\n Ping <@271841393725407242> if out of date`, files: [{ attachment: filePath, name: 'latestCalendar.png' }], ephemeral: !shareCalendar });

	if (shareCalendar) setTimeout(() => { interaction.deleteReply(); }, 1000 * 60 * 5);
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
	deferReply: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	cooldownCount: 120,
	subCommand: 'shareCalendar',
	subCooldownCount: 300,
};