const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { getUserId, sendFollowUpDelete } = require('../../../utils/index');
const { getMercyLimit, getCurrentPulls, incrementUser } = require('./utils');
const { identifierEmojis, initializeMercy, setUser, userAccountExists } = require('../mercyIndex');
const { autocompleteUserAccounts } = require('../utils/functions/userAutoComplete');


async function pullCommand(interaction = new CommandInteraction(), log) {

	await log.initiateCommand({ name: 'pull', category: 'mercy tracker', role: 'Mercy' }); let output;

	const userId = log.member.id;
	const username = log.member.name;
	const count = interaction.options.getInteger('count');
	const shard = interaction.options.getString('shard');

	try {

		// ensure Mercy tracker exists, if not - add
		await initializeMercy(interaction);

		// ensure user account exists, if not - return
		const userAccount = await userAccountExists(interaction, log);
		if (!userAccount) {
			await sendFollowUpDelete(interaction, 'account does not exist', true);
			log.returnCommand('denied', 'account does not exist');
			return;
		}

		/**
	 	*  main command logic
	 	*/

		// get current pulls from the database
		const currentPulls = await getCurrentPulls(userId, userAccount, shard);

		// calculate total pulls
		let totalPulls = currentPulls.count + count;

		// primal use mythical_count
		if (shard === 'primal') {
			totalPulls = currentPulls.mythical_count + count;
		}

		// get mercy limit for the shard type
		const mercyLimit = await getMercyLimit(shard);

		// output
		output = `<@${interaction.user.id}> pulled ${count} ${identifierEmojis[shard]}`;

		// check if total pulls exceed mercy limit
		if (totalPulls >= mercyLimit) {
			// calculate remainder and reset shard count
			const excess = totalPulls - mercyLimit;
			const cycles = Math.floor(totalPulls / mercyLimit);

			// reset shard count
			await setUser(userId, userAccount, shard, 0);

			const followUp = `## **Congratulations ${username}!!** :tada:\n\nYou've pulled ${count} ${identifierEmojis[shard]}'s and surpassed the ${mercyLimit} shard threshold for a guaranteed pull by ${excess}${identifierEmojis[shard]}'s.\n\nYou've now pulled ${cycles > 1 ? `${cycles} ${shard === 'primal' ? 'mythicals' : 'legendaries'}` : `${shard === 'primal' ? 'a mythical' : 'a legendary' }`} ***or*** you may have entered an incorrect amount.\n\nyour mercy count has been reset to 0 `;

			await sendFollowUpDelete(interaction, output, false, 10000);
			await sendFollowUpDelete(interaction, followUp);

			log.returnCommand('failed', 'exceeded mercy');
			return;
		}
		else {
			// increment count
			await incrementUser(userId, userAccount, shard, count);

			await sendFollowUpDelete(interaction, output, false, 10000);
			return;
		}
	}
	catch (error) {
		log.errorHandling(error);
	}
	finally {
		log.finalizeCommand();
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
	defer: true,
	moderator: false,
	maintenance: false,
	ephemeral: false,
	trace: true,


};