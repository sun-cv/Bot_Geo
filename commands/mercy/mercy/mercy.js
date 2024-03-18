const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
// Logging
const { logUserCommand, commandLog } = require('../../../utils/userLogging/UserCommandLogging/LogUserCommand');
const { updateAccountLastActive } = require('../../../utils/userLogging/updateAccountLastActive');
// Mercy utils
const { initializeMercy, getShardCount, getUserAccounts, mercyConditions, shardIdentifiers, identifierEmojis } = require('../mercyIndex');
// General utils
const { addRoleToUser } = require('../../../utils/functions/addRoleToUser');
// Autocomplete
const { autocompleteUserAccounts } = require('../utils/functions/userAutoComplete');
// Interaction constants
const { getUserId } = require('../../../utils/functions/interactionIndex');


async function mercyCommand(interaction = new CommandInteraction) {

	try {

		/**
		*  Global constants
		*/

		let shareMercy = false;

		const userId = getUserId(interaction);
		// optional share mercy value


		/**
		* Command Initialization
		*/

		// Ensure Mercy tracker exists, if not - Add
		await initializeMercy(interaction);

		/**
		*  Mercy command
		*/

		// User share mercy input
		const shareInputValue = interaction.options.getString('share');
		if (shareInputValue === 'true') { shareMercy = true; }

		// // Define account

		// User account input
		const accountInput = interaction.options.getString('account');
		// Get known accounts
		const userAccounts = await getUserAccounts(userId);
		// Default user account
		let userAccount = userAccounts[0].account;
		// Filter user account Input found
		if (userAccounts.some(user => user.account === accountInput)) {
			// Set user input
			userAccount = accountInput;
		}
		// If not found && not null - deny
		else if (accountInput !== null) {
			interaction.reply(`${accountInput} was not found. Use /register list to confirm account details`);
			commandLog.status = 'Failed';
			return;
		}

		// // Main Command logic

		// Set output
		let output = `__**<@${interaction.user.id}>'s ${userAccount} Mercy:**__\n`;

		// Cycle shard identifiers
		for (const identifier of shardIdentifiers) {
		// Get shard count
			const countValue = await getShardCount(userId, userAccount, identifier);
			// Initiate result
			let result;
			// Primal - Import mythicalResult, legendaryResult
			if (identifier === 'primal') {
				// Mercy condition calculation
				const legendaryResult = mercyConditions[identifier].legendary.base + Math.max(countValue.legendary_count - mercyConditions[identifier].legendary.start, 0) * mercyConditions[identifier].legendary.increase;
				const mythicalResult = mercyConditions[identifier].mythical.base + Math.max(countValue.mythical_count - mercyConditions[identifier].mythical.start, 0) * mercyConditions[identifier].mythical.increase;
				// MErcy % calculation
				result = `${mythicalResult.toFixed(1)}% (Legendary: ${countValue.legendary_count} - ${legendaryResult.toFixed(1)}%)`;
				// set Primal output
				output += `${identifierEmojis[identifier]} ${countValue.mythical_count} - ${result}\n`;
			}
			// Ancient, Void, Sacred
			else {
				const condition = mercyConditions[identifier];
				result = `${(condition.base + Math.max(countValue.count - condition.start, 0) * condition.increase).toFixed(1)}%`;
				// set Ancient, void, Sacred output
				output += `${identifierEmojis[identifier]} ${countValue.count} - ${result}\n`;
			}
		}

		// Send output if share mercy true
		interaction.reply({ content: output, fetchReply: shareMercy, ephemeral: !shareMercy })
			.then(message => {
				if (shareMercy) {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							message.delete().then(resolve).catch(reject);
						}, 15000);
					});
				}
			});

		// Update last active
		await updateAccountLastActive(userId, userAccount);
		// Logging
		commandLog.output = output;
		commandLog.status = 'Success';
		return;
	}
	catch (error) {
		console.log('Error detected in Mercy - Mercy command');

		// Logging
		commandLog.status = 'failed';
		commandLog.error = error;

		throw error;
	}
	finally {
		// Add mercy role to user
		addRoleToUser(interaction, 'Mercy');
		// Logging
		commandLog.category = 'Mercy';
		logUserCommand(interaction, commandLog);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mercy')
		.setDescription('Check your mercy count')
		.addStringOption(option =>
			option.setName('account')
				.setDescription('Alt account')
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('share')
				.setDescription('Share your mercy count')
				.addChoices(
					{ name: 'true', value: 'true' })),
	// Autocomplete interaction handler
	async autocomplete(interaction) {
		const userId = getUserId(interaction);
		const focusedValue = interaction.options.getFocused();
		const choices = autocompleteUserAccounts[userId];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	execute: mercyCommand,
	command: true,
	maintenance: false,
	cooldownCount: 0,
	subCommand: 'shareMercy',
	subCooldownCount: 120,
};