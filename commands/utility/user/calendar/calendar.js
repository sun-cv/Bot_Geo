const { CommandInteraction, SlashCommandBuilder } = require('discord.js');

async function plariumCalendar(interaction = new CommandInteraction, log) {

	await log.initiateCommand({ name: 'calendar', category: 'utility' });

	const month = '7';
	const day = '4';

	const lastUpdate = `${month}/${day}`;
	const lastScreenshot = `${month}-${day}`;

	const shareCalendar = interaction.options.getString('share') === 'true';

	const filePath = `D:/Projects/Bot_Geo/commands/utility/user/calendar/calendarScreenshots/${lastScreenshot}.png`;

	try {


		interaction.editReply({ content: `last updated on: ${lastUpdate}\n\n Ping <@271841393725407242> if out of date`, files: [{ attachment: filePath, name: 'latestCalendar.png' }], ephemeral: !shareCalendar });

		if (shareCalendar) setTimeout(() => { interaction.deleteReply(); }, 1000 * 60 * 5);

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
	cooldownCount: 120,
	subCommand: 'shareCalendar',
	subCooldownCount: 300,
	trace: true,
};