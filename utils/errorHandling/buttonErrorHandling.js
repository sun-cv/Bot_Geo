// Error handler
const { localErrorLogging } = require('./localErrorLogging');

async function buttonErrorHandling(buttonFunction, interaction) {
	try {
		await buttonFunction(interaction);
	}
	catch (error) {

		const event = 'button';

		// Pass to local define and logging
		localErrorLogging(error, interaction, event);
		// Send a message to the user
		if (!interaction.user.bot) {
			await interaction.followUp({ content: 'Sorry, something went wrong while processing your button interaction.', ephemeral: true });
		}
	}
}

module.exports = { buttonErrorHandling };
