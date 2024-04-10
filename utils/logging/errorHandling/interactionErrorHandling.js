async function interactionErrorHandling() {

	try {

		const interaction = this.interaction.discord;

		if (interaction.isAutocomplete() || interaction.user.bot) {
			return;
		}

		if (interaction.isCommand()) {

			const response = { content: `Sorry ${this.member.name}, something went wrong while executing your interaction.`, ephemeral: true };

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

		if (interaction.isButton()) {

			await interaction.followUp({ content: `Sorry ${this.member.name}, something went wrong while processing your button interaction.`, ephemeral: true });

		}
	}
	catch (error) {
		console.log('error detected in class Log: interactionErrorHandling', error);
	}
}


module.exports = {
	interactionErrorHandling,
};