const { Events, Collection } = require('discord.js');
const { autocompleteUserAccounts } = require('../commands/autocomplete/userAutoComplete');
const { modCheck, adminCheck } = require('../utilities/functions/roles/modCheck');
const { log } = require('../utilities/log/log');

module.exports = {
	name: Events.InteractionCreate,
	async execute(client, interaction) {
		try {

			if (interaction.isAutocomplete()) {
				await handleAutocomplete(interaction);
				return;
			}

			await log.emitAwait('interaction', interaction);

			if (interaction.isModalSubmit()) {
				await handleModal(interaction);
			}
			if (interaction.isAnySelectMenu()) {
				await handleMenu(interaction, client);
			}
			if (interaction.isButton()) {
				await handleButton(interaction, client);
			}
			if (interaction.isChatInputCommand()) {
				await handleCommand(interaction);
			}
			log.emit('interaction', interaction);

		}
		catch (error) {
			console.log(error);
		}
	} };

/**
 * ----------------
 * Autocomplete handler
 * ----------------
 */

async function handleAutocomplete(interaction) {
	try {

		const command = interaction.client.commands.get(interaction.commandName);
		const autoCompleteCases = ['account'];
		let completed;

		autoCompleteCases.forEach(caseName => { completed = autocompleteCase(interaction, caseName); });

		if (!completed)	command.autocomplete(interaction);

	}
	catch (error) {
		console.log(error);
	}
}

/**
 * ----------------
 * Modal Handler
 * ----------------
 */

async function handleModal(interaction) {
	interaction.deferUpdate();
}

/**
 * ----------------
 * Menu Handler
 * ----------------
 */

async function handleMenu(interaction, client) {
	try {

		const menu = client.menus.get(interaction.customId);
		const { defer = false } = menu;

		if (defer) await interaction.deferUpdate();

		menu.execute(interaction);
	}
	catch (error) {
		console.log(error);
	}
}
/**
 * ----------------
 * Button Handler
 * ----------------
 */

async function handleButton(interaction, client) {
	try {
		const button = client.buttons.get(interaction.customId);
		const member = interaction.member;

		await interaction.deferUpdate();

		if (!modCheck(member)) {
			if (await cooldownHandler(interaction, button, 'button')) {
				console.log(`${member.user.username} was cooled out`);
				return;
			}
		}
		await button.execute(interaction);
	}
	catch (error) {
		console.log(error);
	}
}

/**
 * ----------------
 * Command handler
 * ----------------
 */

async function handleCommand(interaction) {
	try {

		const command = interaction.client.commands.get(interaction.commandName);
		const { moderator = false, maintenance = false } = command;
		const member = interaction.member;

		if (maintenance && adminCheck(member)) return interaction.reply({ content: 'This command is disabled.', ephemeral: true });

		if (moderator && !modCheck(member)) {
			return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
		}

		if (!moderator && await cooldownHandler(interaction, command, 'command')) {
			console.log(`${member.user.username} was cooled out`);
			return;
		}

		const share = interaction.options?.getString('share') === 'true' || command.ephemeral === false;
		await interaction.deferReply({ ephemeral: !share });

		if (interaction.isCommand()) {
			await command.execute(interaction);
		}
		else {
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
	catch (error) {
		console.log(error);
	}
}

/**
 * ----------------
 * Autocomplete case handler
 * ----------------
*/

function autocompleteCase(interaction, input) {
	try {

		switch (input) {
		case 'account':
			if (interaction.options._hoistedOptions.some(option => option.name === 'account')) {
				const userId = interaction.member.user.id;
				const focusedValue = interaction.options.getFocused();

				const choices = autocompleteUserAccounts[userId] || [];
				const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));

				interaction.respond(
					filtered.map(choice => ({ name: choice, value: choice })),
				);
				return true;
			}
		}

	}
	catch (error) {
		console.log(error);
	}
}

/**
 * ----------------
 * Cooldown handler
 * ----------------
 */

const cooldowns = new Collection();

async function cooldownHandler(interaction, item, type) {
	try {

		const { member } = interaction;
		const id = type === 'button' ? interaction.customId : interaction.commandName;
		const {
			deferUpdate = false,
			defer = false,
			cooldown = -1,
			subCommand = null,
			subCooldown = null,
		} = item;

		let returnCooldown;

		const shareInput = interaction.options?.getString('share');
		const share = shareInput === 'true';

		const currentId = share ? subCommand : id;
		const currentCooldown = share ? subCooldown : cooldown ;

		const cooldownAmount = currentCooldown * 1000;
		const cooldownTime = currentCooldown / 60;

		const cooldownKey = `${currentId}-${member.id}`;

		const timestamps = cooldowns.get(cooldownKey) || cooldowns.set(cooldownKey, new Collection()).get(cooldownKey);

		const currentTime = Date.now();

		if (timestamps.has(cooldownKey)) {
			const expirationTime = timestamps.get(cooldownKey) + cooldownAmount;

			if (currentTime < expirationTime) {
				returnCooldown = true;
				const timeLeft = (expirationTime - currentTime) / 1000;
				if (defer || deferUpdate) {
					return interaction.followUp({ content: `${cooldownKey} has a ${cooldownTime} minute cooldown. You must wait ${timeLeft.toFixed(0)} seconds`, ephemeral: true });
				}
				else {
					return interaction.reply({ content: `${cooldownKey} has a ${cooldownTime} minute cooldown. You must wait ${timeLeft.toFixed(0)} seconds`, ephemeral: true });
				}
			}
		}
		timestamps.set(cooldownKey, currentTime);
		setTimeout(() => timestamps.delete(member.id), cooldownAmount);

		return returnCooldown;
	}
	catch (error) {
		console.log(error);
	}
}
