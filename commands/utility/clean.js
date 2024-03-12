const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
// Logging
const { commandLog, logUserCommand } = require('../../utils/userLogging/UserCommandLogging/LogUserCommand');
const { isModerator } = require('../../utils/functions/isModerator');

async function cleanCommand(interaction = new CommandInteraction()) {

	try {

		const amount = interaction.options.getInteger('amount');

		// Check if the user has the "Moderator" role
		if (!(await isModerator(interaction))) {
			await interaction.reply({ content : '<:GeoNo:1197290091203280906>You do not have permission to use this command ', ephemeral : true });

			commandLog.status = 'Denied';
			return;
		}

		// Fetch the messages
		const messages = await interaction.channel.messages.fetch({ limit: amount });

		// Bulk delete the messages and catch any errors
		await interaction.channel.bulkDelete(messages)
			.then(deletedMessages => {
			// Confirm deletion
				interaction.reply({ content : `Deleted ${deletedMessages.size} messages!`, ephemeral : true });
			});

		commandLog.status = 'success';
		return;

	}
	catch (error) {

		interaction.reply({ content: 'There was an error trying to delete messages. Make sure the messages are not older than 14 days.', ephemeral: true });

		commandLog.status = 'failed';
		commandLog.error = error;
		commandLog.output = 'none';
		throw error;

	}
	finally {
		commandLog.category = 'Utility';
		logUserCommand(interaction, commandLog);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clean')
		.setDescription('Removes the last x number of messages in the channel.')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Number of messages to delete')
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(100)),
	execute: cleanCommand,
	command: true,
};