// Error handler
const { localErrorLogging } = require('./localErrorLogging');

async function interactionErrorHandling(interactionFunction, interaction, tracer) {
	try {
		await interactionFunction(interaction, tracer);
	}
	catch (error) {

		const event = 'interaction';

		// Pass to local define and logging
		localErrorLogging(error, interaction, event);

		// Send a message to the user
		if (!interaction.isAutocomplete()) {
			const response = { content: 'Sorry, something went wrong while executing your interaction.', ephemeral: true };

			if (!interaction.deferred && !interaction.replied) {
				await interaction.reply(response);
			}
			else if (interaction.deferred && !interaction.replied) {
				await interaction.editReply(response);
			}
			else if (interaction.replied) {
				await interaction.followUp(response);
			}
		}

		console.error(`\nError executing interaction ${interactionFunction.name}: ${error.message}\n`);

	}
}


module.exports = { interactionErrorHandling };