/* eslint-disable no-unused-vars */
const { Events, Collection } = require('discord.js');
const { admin } = require('../config.json');
const { interactionErrorHandling, newTimestamp, activateUpdateUser } = require('../utils/index');
const { cooldownHandler } = require('./utils/functions/cooldownHandler');
const { commandTrace, userCommandTrace } = require('./utils/objects/userCommandTrace');

// Collections
const cooldownCommands = new Collection();


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		const { message, member, channel, guild, commandName, customId } = interaction;
		const command = interaction.client.commands.get(commandName);

		if (interaction.isAutocomplete()) {
			try {
				await interactionErrorHandling(command.autocomplete, interaction);
			}
			catch (error) {
				console.error(error);
			}
		}

		if (interaction.isChatInputCommand()) {

			const {
				data = null,
				deferReply = true,
				moderator = false,
				maintenance = false,
				ephemeral = true,
				cooldownCount = null,
				subCommand = null,
				subCooldownCount = null,
			} = command;

			const timestamp = await newTimestamp('hour');

			// Mod check
			if (moderator) {
				if (!member.roles.cache.some(role => role.name === 'Moderator')) {
					interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
					console.log(`${timestamp}: ${member.user.username} was denied access to ${commandName}`);
					return;
				}
			}

			const trace = await commandTrace(member.user.id, commandName, timestamp);

			// Defer logic
			if (deferReply) {

				const shareValue = interaction.options.getString('share');
				const share = shareValue === 'true' ? true : false;

				const context = userCommandTrace.get(trace);
				try {
					if (ephemeral && !share) {
						console.log(`${context.count} - ${context.time}: ${interaction.member.user.username} deferred ${commandName} - ephemeral`);
						await interactionErrorHandling(interaction.deferReply.bind(interaction, { ephemeral: true }));
					}
					else {
						console.log(`${context.count} - ${context.time}: ${interaction.member.user.username} deferred ${commandName}`);
						await interactionErrorHandling(interaction.deferReply.bind(interaction));
					}
				}
				catch (error) {
					console.log('Error detected in defer reply');
				}
			}
			// Tracing command handling time


			// ensure exists
			await activateUpdateUser(interaction);

			// Command Cooldowns
			let cooldown;
			if (!member.roles.cache.some(role => role.name === 'Moderator')) {
				cooldown = await cooldownHandler(interaction, cooldownCommands);
				if (cooldown) {
					console.log(`${timestamp}: ${member.user.username} was cooled out`);
				}
			}

			// Maintenance
			if (maintenance && member.id !== admin) return interaction.reply({ content: 'This command is disabled.', ephemeral: true });

			// Command handling
			if (!cooldown) {
				try {
					if (interaction.isCommand()) {
						await interactionErrorHandling(command.execute, interaction, trace);
					}
					else if (deferReply) {
						interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
					}
					else {
						interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
					}
				}
				catch (error) {
					console.error(error);
				}
			}
		}
	},
};