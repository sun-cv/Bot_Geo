/* eslint-disable no-unused-vars */
const { Events, Collection } = require('discord.js');
const { admin } = require('../config.json');
const { logUserCommand, commandLog, interactionErrorHandling, newTimestamp, activateUpdateUser, buttonErrorHandling } = require('../utils/index');
const { InteractionCooldownHandler, buttonCooldownHandler } = require('./utils/functions/cooldownHandlers/index');
const { commandTrace, userCommandTrace } = require('../utils/logging/objects/userCommandTrace');
const { Log } = require('../utils/logging/logging');


// Collections
const cooldownButtons = new Collection();
const cooldownCommands = new Collection();

const DEBUG = false;

module.exports = {
	name: Events.InteractionCreate,
	async execute(client, interaction) {

		const log = new Log();

		await log.initialize(interaction);

		const { member, commandName, customId } = interaction;
		const command = interaction.client.commands.get(commandName);

		let share;
		if (interaction.options && interaction.options.getString('share') !== undefined) share = interaction.options.getString('share') === 'true';

		/**
		 * ----------------
		 * Autocomplete
		 * ----------------
		 */

		if (interaction.isAutocomplete()) {
			try {
				command.autocomplete(interaction);
			}
			catch (error) {
				console.error('error detected in isAutoComplete -', error);
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
					console.log(`${log.time.hour}: ${member.user.username} was cooled out`);
				}
			}

			const buttonName = 'btn-' + customId;

			await log.initiateButton();

			// Button handling
			if (!buttonCooldown) {
				try {
					await buttonErrorHandling(button.execute, interaction, log);
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
				defer = true,
				moderator = false,
				maintenance = false,
				ephemeral = true,
				trace = null,
				subCommand = null,
				cooldownCount = null,
				subCooldownCount = null,
			} = command;

			const timestamp = newTimestamp('hour');

			// Mod check
			if (moderator) {
				if (!member.roles.cache.some(role => role.name === 'Moderator')) {

					interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });

					log.update('command', { status: 'denied', output: 'none' });
					log.finalize();
					return;
				}
			}

			// Defer logic
			if (defer) {
				try {
					if (ephemeral && !share) {
						if (DEBUG) console.log(`${log.command.tracer.context.count} - ${log.command.tracer.context.time}: ${interaction.member.user.username} deferred ${commandName} - ephemeral`);
						await interaction.deferReply({ ephemeral: true });

					}
					else {
						if (DEBUG) console.log(`${log.command.tracer.context.count} - ${log.command.tracer.context.time}: ${interaction.member.user.username} deferred ${commandName}`);
						await interaction.deferReply();

					}
				}
				catch (error) {
					console.log('Error detected in defer reply');
				}
			}

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

						command.execute(interaction, log);
					}
					else if (defer) {
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