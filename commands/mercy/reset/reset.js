const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
// Database
const { db } = require('../../../database/utils/databaseIndex');
// Logging
const { commandLog, logUserCommand } = require('../../../utils/userLogging/UserCommandLogging/LogUserCommand');
const { updateAccountLastActive } = require('../../../utils/userLogging/updateAccountLastActive');
// Mercy utils
const { identifierEmojis, initializeMercy, getUserAccounts, setUser } = require('../mercyIndex');
// General utils
const { addRoleToUser } = require('../../../utils/functions/addRoleToUser');
// Autocomplete
const { autocompleteUserAccounts } = require('../utils/functions/userAutoComplete');
// Interaction constants
const { getUserId, getUsername } = require('../../../utils/functions/interactionIndex');


async function resetMercyCommand(interaction = new CommandInteraction()) {

	// Logging
	let output;

	try {

		/**
        *  Global constants
        */

		const userId = getUserId(interaction);
		const username = getUsername(interaction);
		const shard = interaction.options.getString('shard');
		const count = 0;

		/**
        *  Initialize command
        */

		// Ensure Mercy tracker exists, if not - Add
		await initializeMercy(interaction);

		/**
        *  Reset command
        */

		/*
            Define account
        */

		// User account input
		const accountInput = interaction.options.getString('account');
		// Get known accounts
		const userAccounts = await getUserAccounts(userId);
		// default user account
		let userAccount = userAccounts[0].account;
		// Confirm account exists ;
		if (userAccounts.some(user => user.account === accountInput)) {
			userAccount = accountInput;
		}
		else if (accountInput !== null) {

			interaction.reply({ content: `${accountInput} was not found. Check /register list to confirm account details`, ephemeral: true });

			commandLog.status = 'Failed';

			return;
		}

		if (shard === 'all') {

			// Reset the count for all shard types
			const shardcycle = ['ancient', 'void', 'primal', 'sacred'];
			// WRITE - Cycle all shards
			shardcycle.forEach(shardType => {
				setUser(userId, userAccount, shardType, count);
			});

			interaction.reply({ content: 'You\'ve successfully reset all mercy counts. Stay awesome!', ephemeral: true });

			commandLog.status = 'Success';
			return;
		}
		else {

			// Reset the count for the specified shard type
			// Primal ternary
			if (shard === 'primal_legendary' || shard === 'primal_mythical') {

				const column = shard === 'primal_legendary' ? 'legendary_count' : 'mythical_count';
				// WRITE - reset Primal count
				await db.run(`UPDATE mercy_tracker SET ${column} = 0 WHERE user_id = ? AND account = ? AND shard = 'primal'`, [userId, userAccount]);

				console.log(`${username} row ${shard} reset`);
			}
			else {

				// WRITE - Reset Ancient, Void, Sacred
				setUser(userId, userAccount, shard, count);

				console.log(`${username} Row ${shard} reset`);
			}

			// Send the output
			let emoji;
			if (shard === 'primal_legendary' || shard === 'primal_mythical') {
				emoji = identifierEmojis['primal'];
			}
			else {
				emoji = identifierEmojis[shard];
			}
			interaction.reply({ content: `You've successfully reset ${emoji}'s - Congratulations on your pull!`, ephemeral: true });

			// Update last active
			await updateAccountLastActive(userId, userAccount);
			// Logging
			commandLog.status = 'Success';
			return;

		}
	}
	catch (error) {
		console.log('Error detected in Mercy - reset command');
		// Logging
		commandLog.status = 'failed';
		commandLog.error = error;
		throw error;
	}
	finally {
		// Add Mercy role
		addRoleToUser(interaction, 'Mercy');
		// Logging
		commandLog.category = 'mercy';
		commandLog.output = 'none';
		logUserCommand(interaction, commandLog);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Resets mercy for a specific shard type')
		.addStringOption(option =>
			option.setName('shard')
				.setDescription('The type of shard to reset')
				.setRequired(true)
				.addChoices(
					{ name: 'ancient', value: 'ancient' },
					{ name: 'void', value: 'void' },
					{ name: 'primal legendary', value: 'primal_legendary' },
					{ name: 'primal mythical', value: 'primal_mythical' },
					{ name: 'sacred', value: 'sacred' },
					{ name: 'all', value: 'all' },
				))
		.addStringOption(option =>
			option.setName('account')
				.setDescription('Alt account')
				.setAutocomplete(true)),
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
	execute: resetMercyCommand,
	command: true,
};