const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { logUserCommand, commandLog } = require('../../../utils/index');


async function cleanCommand(interaction = new CommandInteraction()) {

	try {

		const amount = interaction.options.getInteger('amount');

		// Fetch the messages
		const messages = await interaction.channel.messages.fetch({ limit: amount });

		// Bulk delete the messages and catch any errors
		await interaction.channel.bulkDelete(messages)
			.then(deletedMessages => {
			// Confirm deletion
				interaction.editReply({ content : `Deleted ${deletedMessages.size} messages!`, ephemeral : true });
			});

		commandLog.status = 'success';
		return;

	}
	catch (error) {

		interaction.editReply({ content: 'There was an error trying to delete messages. Make sure the messages are not older than 14 days.', ephemeral: true });

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
	deferReply: true,
	moderator: true,
	maintenance: false,
	ephemeral: true,

};