const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
// Logging
const { logUserCommand, commandLog } = require('../../../utils/userLogging/UserCommandLogging/LogUserCommand');
const { updateAccountLastActive } = require('../../../utils/userLogging/updateAccountLastActive');
// Pull utils
const { getCurrentPulls, incrementUser } = require('./utils');
// Mercy utils
const { identifierEmojis, initializeMercy, getUserAccounts, setUser } = require('../mercyIndex');
const { getMercyLimit } = require('./utils/getMercyLimit');
// General utils
const { addRoleToUser } = require('../../../utils/functions/addRoleToUser');
// Autocomplete
const { autocompleteUserAccounts } = require('../utils/functions/userAutoComplete');
// Interaction constants
const { getUserId } = require('../../../utils/functions/interactionIndex');


async function pullCommand(interaction = new CommandInteraction()) {

	try {

		/**
	 	*  Global constants
	 	*/

		const userId = getUserId(interaction);
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

			interaction.reply({ content: `${accountInput} was not found.\n\n Use /register list to confirm account details`, ephemeral: true });

			commandLog.status = 'Failed';
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
			interaction.reply({ content: `You've pulled ${count} ${identifierEmojis[shard]}'s.\n\nYou've surpassed the ${mercyLimit} shard threshold for a 100% guaranteed pull by ${excess}${identifierEmojis[shard]}'s.\n\n**Congratulations!** You've now either pulled ${cycles > 1 ? `${cycles} ${shard === 'primal' ? 'mythicals' : 'legendaries'}` : `${shard === 'primal' ? 'a mythical' : 'a legendary' }`} or you may have entered an incorrect amount. \n\nYour mercy count has been reset to 0 `, ephemeral: true });

			commandLog.status = 'Failed';
			return;
		}
		else {

			// WRITE - If total pulls do not exceed mercy limit, proceed
			await incrementUser(userId, userAccount, shard, count);

			await interaction.reply({ content: `<@${interaction.user.id}> pulled ${count} ${identifierEmojis[shard]}`, fetchReply: true });

			setTimeout(() => { interaction.deleteReply(); }, 15000);

			// Update last active
			await updateAccountLastActive(userId, userAccount);
			// Logging
			commandLog.status = 'Success';
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
		logUserCommand(interaction, commandLog);
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
	maintenance: false,

};