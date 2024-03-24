const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { logUserCommand, commandLog, updateAccountLastActive, addRoleToUser, getUserId, getUsername } = require('../../../utils/index');
const { getMercyLimit, getCurrentPulls, incrementUser } = require('./utils');
const { identifierEmojis, initializeMercy, getUserAccounts, setUser } = require('../mercyIndex');
const { autocompleteUserAccounts } = require('../utils/functions/userAutoComplete');


async function pullCommand(interaction = new CommandInteraction(), trace) {

	try {

		/**
	 	*  Global constants
	 	*/

		const userId = getUserId(interaction);
		const username = getUsername(interaction);
		const count = interaction.options.getInteger('count');
		const shard = interaction.options.getString('shard');

		/**
     	*  Initialize command
     	*/

		// Ensure Mercy tracker exists, if not - Add
		await initializeMercy(interaction);

		/**
     	*  Pull Command
     	*/

		// // Define account

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

			interaction.followUp({ content: `${accountInput} was not found.\n\n Use /register list to confirm account details`, ephemeral: true });

			commandLog.status = 'failed';
			return;
		}

		// // Main Command logic

		// Get current pulls from the database
		const currentPulls = await getCurrentPulls(userId, userAccount, shard);

		// Calculate total pulls
		let totalPulls = currentPulls.count + count;

		// Primal use mythical_count
		if (shard === 'primal') {
			totalPulls = currentPulls.mythical_count + count;
		}

		// Get mercy limit for the shard type
		const mercyLimit = await getMercyLimit(shard);

		// Check if total pulls exceed mercy limit
		if (totalPulls >= mercyLimit) {
			// Calculate remainder and reset shard count
			const excess = totalPulls - mercyLimit;
			const cycles = Math.floor(totalPulls / mercyLimit);
			// WRITE - Reset shard count
			await setUser(userId, userAccount, shard, 0);
			// Notify user exceeded mercy limit
			await interaction.editReply({ content: `<@${interaction.user.id}> pulled ${count} ${identifierEmojis[shard]}` });

			setTimeout(() => { interaction.deleteReply(); }, 10000);

			interaction.followUp({ content: `## **Congratulations ${username}!!** :tada:\n\nYou've pulled ${count} ${identifierEmojis[shard]}'s and surpassed the ${mercyLimit} shard threshold for a guaranteed pull by ${excess}${identifierEmojis[shard]}'s.\n\nYou've now pulled ${cycles > 1 ? `${cycles} ${shard === 'primal' ? 'mythicals' : 'legendaries'}` : `${shard === 'primal' ? 'a mythical' : 'a legendary' }`} ***or*** you may have entered an incorrect amount.\n\nyour mercy count has been reset to 0 `, ephemeral: true });

			commandLog.status = 'failed';
			return;
		}
		else {

			// WRITE - If total pulls do not exceed mercy limit, proceed
			await incrementUser(userId, userAccount, shard, count);

			await interaction.editReply({ content: `<@${interaction.user.id}> pulled ${count} ${identifierEmojis[shard]}` });

			setTimeout(() => { interaction.deleteReply(); }, 10000);

			// Update last active
			updateAccountLastActive(userId, userAccount);
			// Logging
			commandLog.status = 'success';
			return;
		}
	}
	catch (error) {

		console.log('Error detected in Mercy - Pull command');

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
		commandLog.output = 'none';
		logUserCommand(interaction, commandLog, trace);
	}

}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pull')
		.setDescription('Track shard pulls')
		.addIntegerOption(option =>
			option.setName('count')
				.setDescription('Number of shards to pull')
				.setRequired(true)
				.setMinValue(-999)
				.setMaxValue(999))
		.addStringOption(option =>
			option.setName('shard')
				.setDescription('Shard type to pull')
				.setRequired(true)
				.addChoices(
					{ name: 'ancient', value: 'ancient' },
					{ name: 'void', value: 'void' },
					{ name: 'primal', value: 'primal' },
					{ name: 'sacred', value: 'sacred' },
				))
		.addStringOption(option =>
			option.setName('account')
				.setDescription('Alt account to pull shards')
				.setAutocomplete(true),
		),
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
	execute: pullCommand,
	command: true,
	deferReply: true,
	moderator: false,
	maintenance: false,
	ephemeral: false,


};