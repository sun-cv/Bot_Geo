const { CommandInteraction, SlashCommandBuilder } = require('discord.js');
const { logUserCommand, commandLog, updateAccountLastActive, getUserId } = require('../../../utils');


async function plariumCalendar(interaction = new CommandInteraction, trace) {

	const userId = getUserId(interaction);

	const month = '3';
	const day = '24';

	const lastUpdate = `${month}/${day}`;
	const lastScreenshot = `${month}-${day}`;

	let shareCalendar = false;

	const shareInputValue = interaction.options.getString('share');
	if (shareInputValue === 'true') { shareCalendar = true; }

	const filePath = `D:/Projects/Bot_Geo/commands/utility/raid/calendarScreenshots/${lastScreenshot}.png`;
	try {

		interaction.editReply({ content: `last updated on: ${lastUpdate}\n\n Ping <@271841393725407242> if out of date`, files: [{ attachment: filePath, name: 'latestCalendar.png' }], ephemeral: !shareCalendar });

		if (shareCalendar) setTimeout(() => { interaction.deleteReply(); }, 1000 * 60 * 5);

		// Update last active
		updateAccountLastActive(userId);
		// Logging
		commandLog.output = 'none';
		commandLog.status = 'success';
		return;

	}
	catch (error) {
		console.log('Error detected in Utility - Calendar command');

		// Logging
		commandLog.status = 'failed';
		commandLog.error = error;
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