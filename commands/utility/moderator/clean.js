const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

async function cleanCommand(interaction = new CommandInteraction(), log) {

	await log.initiateCommand({ name: 'clean', category: 'utility' });

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

		return;

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
	defer: true,
	moderator: true,
	maintenance: false,
	ephemeral: true,
	trace: true,

};