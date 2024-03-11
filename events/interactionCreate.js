const { Events } = require('discord.js');
const { interactionErrorHandling } = require('../utils/errorHandling/InteractionErrorHandling');
const { getUserId, getUsername } = require('../utils/functions/interactionIndex');
const { activateUpdateUser } = require('../utils/userLogging/activateUpdateUser');


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		// define constants
		const command = interaction.client.commands.get(interaction.commandName);
		const userId = getUserId(interaction);
		const username = getUsername(interaction);

		if (interaction.isChatInputCommand()) {
			try {

				// ensure exists
				await activateUpdateUser(userId, username);
				// execute command with error handling
				await interactionErrorHandling(command.execute, interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		else if (interaction.isAutocomplete()) {
			try {

				// ensure exists
				await activateUpdateUser(userId, username);
				// execute command with error handling
				await interactionErrorHandling(command.autocomplete, interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
	},
};