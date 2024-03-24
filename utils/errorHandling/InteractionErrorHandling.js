// Error handler
const { localErrorLogging } = require('./localErrorLogging');

async function interactionErrorHandling(interactionFunction, interaction, trace) {
	try {
		await interactionFunction(interaction, trace);
	}
	catch (error) {

		const event = 'interaction';

		// Pass to local define and logging
		localErrorLogging(error, interaction, event);

		// Send a message to the user
		if (!interaction.deferred && !interaction.replied) {
			await interaction.reply({ content: 'Sorry, something went wrong while executing your interaction.', ephemeral: true });
		}
		else if (interaction.deferred && !interaction.replied) {
			await interaction.editReply({ content: 'Sorry, something went wrong while executing your interaction.', ephemeral: true });
		}
		else if (interaction.replied) {
			await interaction.followUp({ content: 'Sorry, something went wrong while executing your interaction.', ephemeral: true });
		}
		else {
			// unknown interaction, do nothing.
		}

		console.error(`\nError executing interaction ${interactionFunction.name}: ${error.message}\n`);
	}
}


module.exports = { interactionErrorHandling };