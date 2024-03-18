/* eslint-disable no-unused-vars */
const { Events, Collection } = require('discord.js');
const { admin } = require('../config.json');
const { interactionErrorHandling } = require('../utils/errorHandling/InteractionErrorHandling');
const { activateUpdateUser } = require('../utils/userLogging/activateUpdateUser');
const { cooldownHandler } = require('./utils/functions/cooldownHandler');
const { newTimestamp } = require('../utils/functions/timeKeeping/newTimestamp');

// Collections
const cooldownCommands = new Collection();

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		const { message, member, channel, guild, commandName, customId } = interaction;
		const command = interaction.client.commands.get(commandName);

		// ensure exists
		await activateUpdateUser(interaction);

		if (interaction.isCommand() || interaction.isAutocomplete()) {

			const {
				data = null,
				maintenance = false,
				deferReply = false,
				moderator = false,
				cooldownCount = null,
				subCommand = null,
				subCooldownCount = null,
			} = command;

			// Defer logic
			if (deferReply) {
				console.error('defer command');
				console.error(interaction.member.user.username, interaction.member.id);
				interaction.deferReply();
				console.error('exit', interaction.member.user.username, interaction.member.id);
			}
			// Mod check
			if (moderator) {
				if (!member.roles.cache.some(role => role.name === 'Moderator')) {
					await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
					return;
				}
			}

			// Command Cooldowns
			let cooldown;
			if (!member.roles.cache.some(role => role.name === 'Moderator')) {
				cooldown = await cooldownHandler(interaction, cooldownCommands);
				if (cooldown) {
					const timestamp = await newTimestamp('hour');
					console.log(`${timestamp}: ${member.user.username} was cooled out`);
				}
			}

			// Maintenance
			if (maintenance && member.id !== admin) return interaction.reply({ content: 'This command is disabled.', ephemeral: true });

			if (!cooldown) {
				try {
					if (interaction.isAutocomplete()) {
						await interactionErrorHandling(command.autocomplete, interaction);
					}
					if (interaction.isCommand()) {
						await interactionErrorHandling(command.execute, interaction);
					}
				}
				catch (error) {
					console.error(error);
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}
	},
};