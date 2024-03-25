/* eslint-disable no-unused-vars */
const { Events, Collection } = require('discord.js');
const { admin } = require('../config.json');
const { logUserCommand, commandLog, interactionErrorHandling, newTimestamp, activateUpdateUser, buttonErrorHandling } = require('../utils/index');
const { InteractionCooldownHandler, buttonCooldownHandler } = require('./utils/functions/cooldownHandlers/index');
const { commandTrace, userCommandTrace } = require('./utils/objects/userCommandTrace');

// Collections
const cooldownButtons = new Collection();
const cooldownCommands = new Collection();

const DEBUG = false;
const tracing = false;

module.exports = {
	name: Events.InteractionCreate,
	async execute(client, interaction) {

		if (DEBUG) console.error('interaction started!', interaction.member.id);

		const { message, member, channel, guild, commandName, customId } = interaction;
		const command = interaction.client.commands.get(commandName);

		if (channel.type === 'DM') return interaction.reply({ content: 'Can\'t use commands here.', ephemeral: true });

		/**
		 * ----------------
		 * Autocomplete
		 * ----------------
		 */

		if (interaction.isAutocomplete()) {
			try {
				await interactionErrorHandling(command.autocomplete, interaction);
			}
			catch (error) {
				console.error(error);
			}
		}

		/**
		 * ----------------
		 * Button Handler
		 * ----------------
		 */

		if (interaction.isButton()) {

			const button = client.buttons.get(customId);
			if (!button) return;

			const timestamp = await newTimestamp('hour');

			const {
				deferUpdate = false,
				cooldown = -1,
			} = button;

			if (deferUpdate) {
				await interaction.deferUpdate();
			}

			// Button Cooldowns
			let buttonCooldown;
			if (!member.roles.cache.some(role => role.name === 'Moderator')) {
				buttonCooldown = await buttonCooldownHandler(interaction, button, cooldownButtons);
				if (buttonCooldown) {
					console.log(`${timestamp}: ${member.user.username} was cooled out`);
				}
			}

			const buttonName = 'btn-' + customId;

			// Button handling
			if (!buttonCooldown) {
				try {
					buttonErrorHandling(button.execute, interaction);
				}
				catch (error) {
					console.error(error);
				}
			}

		}

		/**
		 * ----------------
		 * Command handling
		 * ----------------
		 */

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

					commandLog.status = 'denied';
					commandLog.output = 'none';

					await logUserCommand(interaction, commandLog);
					await activateUpdateUser(interaction);
					return;
				}
			}

			// Tracing command handling time
			const trace = await commandTrace(member.user.id, commandName, timestamp);

			// Defer logic
			if (deferReply) {

				const shareValue = interaction.options.getString('share');
				const share = shareValue === 'true' ? true : false;

				const context = userCommandTrace.get(trace);
				try {
					if (ephemeral && !share) {
						if (tracing) console.log(`${context.count} - ${context.time}: ${interaction.member.user.username} deferred ${commandName} - ephemeral`);
						await interactionErrorHandling(interaction.deferReply.bind(interaction, { ephemeral: true }));
					}
					else {
						if (tracing)console.log(`${context.count} - ${context.time}: ${interaction.member.user.username} deferred ${commandName}`);
						await interactionErrorHandling(interaction.deferReply.bind(interaction));
					}
				}
				catch (error) {
					console.log('Error detected in defer reply');
				}
			}

			// ensure exists
			await activateUpdateUser(interaction);

			// Command Cooldowns
			let interactionCooldown;
			if (!member.roles.cache.some(role => role.name === 'Moderator')) {
				interactionCooldown = await InteractionCooldownHandler(interaction, cooldownCommands);
				if (interactionCooldown) {
					console.log(`${timestamp}: ${member.user.username} was cooled out`);
				}
			}

			// Maintenance
			if (maintenance && member.id !== admin) return interaction.reply({ content: 'This command is disabled.', ephemeral: true });

			// Command handling
			if (!interactionCooldown) {
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