const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

async function cleanCommand(interaction = new CommandInteraction()) {
	try {

		const amount = interaction.options.getInteger('amount');

		const messages = await interaction.channel.messages.fetch({ limit: amount });

		await interaction.channel.bulkDelete(messages)
			.then(deletedMessages => {
				interaction.editReply({ content : `Deleted ${deletedMessages.size} messages!`, ephemeral : true });
			});

		return;
	}
	catch (error) {
		console.log(error);
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