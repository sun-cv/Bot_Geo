const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { getUserId, sendFollowUpDelete } = require('../../../utils/index');
const { identifierEmojis, mercyConditions, initializeMercy, getShardCount, userAccountExists } = require('../mercyIndex');
const { autocompleteUserAccounts } = require('../utils/functions/userAutoComplete');


async function successCommand(interaction = new CommandInteraction(), log) {

	await log.initiateCommand({ name: 'success', category: 'mercy tracker', role: 'Mercy' });

	let output;

	const userId = log.member.id;
	const number = interaction.options.getInteger('number');
	const shard = interaction.options.getString('shard');
	const doubleEvent = interaction.options.getString('2x');

	const shareSuccess = interaction.options.getString('share') === 'true';

	try {

		// Ensure Mercy tracker exists, if not - Add
		await initializeMercy(interaction);

		// ensure user account exists, if not - return
		const userAccount = await userAccountExists(interaction, log);
		if (!userAccount) {
			log.returnCommand('denied', 'account does not exist');
			return;
		}

		/**
	 	*  main command logic
	 	*/

		// Fetch the user's current shard count from the database
		let column;
		let countValue;
		let currentCount;
		let initialCount;

		try {

			if (shard === 'primal_legendary') {

				column = 'legendary_count';

				countValue = await getShardCount(userId, userAccount, 'primal', column);

				currentCount = countValue ? countValue.legendary_count : 0;
				initialCount = currentCount;

				currentCount = countValue.legendary_count;
				initialCount = currentCount;
			}
			else if (shard === 'primal_mythical') {

				column = 'mythical_count';

				countValue = await getShardCount(userId, userAccount, 'primal', column);

				currentCount = countValue ? countValue.mythical_count : 0;
				initialCount = currentCount;
			}
			else {

				countValue = await getShardCount(userId, userAccount, shard, 'count');
				// Destructure count value
				const { count } = countValue;

				currentCount = count ? count : 0;
				initialCount = currentCount;

			}

		}

		catch (error) {
			log.errorHandling(error);
		}

		// Check if start number is provided
		const startNumber = interaction.options.getInteger('count');

		if (startNumber !== null) {
			currentCount = startNumber;
			initialCount = startNumber;
		}

		let adjustedMercyConditions;

		if (shard === 'primal_legendary') {
			adjustedMercyConditions = mercyConditions.primal.legendary;
		}
		else if (shard === 'primal_mythical') {
			adjustedMercyConditions = mercyConditions.primal.mythical;
		}
		else {
			adjustedMercyConditions = mercyConditions[shard];
		}

		// Calculate the failure chance for each pull
		let totalFailureChance = 1;
		for (let i = 0; i < number; i++) {
			let failureChance;
			let baseChance = adjustedMercyConditions.base;
			if (doubleEvent === 'yes') {
				baseChance *= 2;
			}
			if (currentCount < adjustedMercyConditions.start) {
				failureChance = 1 - baseChance / 100;
			}
			else {
				failureChance = 1 - (baseChance + (currentCount - adjustedMercyConditions.start + 1) * adjustedMercyConditions.increase) / 100;
				// Ensure failureChance never becomes zero
				if (failureChance <= 0) {
					failureChance = 0.01;
				}
			}
			totalFailureChance *= failureChance;
			currentCount++;
		}

		// Calculate the total success chance
		let totalSuccessChancePercent = (1 - totalFailureChance) * 100;

		// Check if the success chance exceeds 100%
		if (totalSuccessChancePercent > 100) {
			totalSuccessChancePercent = 100;
		}

		// Define the champion type based on the shard type
		let championType = 'legendary champion';
		if (shard === 'primal_mythical') {
			championType = 'mythical champion';
		}

		// Modify the shard name for the output if it's a primal type
		let shardNameForOutput = shard;
		if (shard === 'primal_legendary' || shard === 'primal_mythical') {
			shardNameForOutput = 'primal';
		}

		output = `You've pulled ${initialCount} ${identifierEmojis[shardNameForOutput]} shards to date <@${interaction.user.id}>.\n \nThe cumulative success chance of pulling a ${championType} from ${number} ${shardNameForOutput.replace('_', ' ')} shards is approximately ${totalSuccessChancePercent.toFixed(2)}%.`;

		// Send the output
		sendFollowUpDelete(interaction, output, !shareSuccess, 15000);
		return;

	}
	catch (error) {
		log.errorHandling(error);
	}
	finally {
		log.finalizeCommand(output);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('success')
		.setDescription('Calculates the cumulative mercy success chance.')
		.addIntegerOption(option =>
			option.setName('number')
				.setDescription('The number of shards to calculate.')
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(999))
		.addStringOption(option =>
			option.setName('shard')
				.setDescription('The type of shard to pull.')
				.setRequired(true)
				.addChoices(
					{ name: 'ancient', value: 'ancient' },
					{ name: 'void', value: 'void' },
					{ name: 'primal legendary', value: 'primal_legendary' },
					{ name: 'primal mythical', value: 'primal_mythical' },
					{ name: 'sacred', value: 'sacred' },
				))
		.addIntegerOption(option =>
			option.setName('count')
				.setDescription('Specify your own starting count.')
				.setRequired(false)
				.setMinValue(0)
				.setMaxValue(999))
		.addStringOption(option =>
			option.setName('2x')
				.setDescription('Is it a 2x event?')
				.setRequired(false)
				.addChoices(
					{ name: 'true', value: 'yes' },
					{ name: 'false', value: 'no' },
				))
		.addStringOption(option =>
			option.setName('account')
				.setDescription('Alt account')
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('share')
				.setDescription('Share your success rate')
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
	execute: successCommand,
	command: true,
	deferReply: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	cooldownCount: 0,
	subCommand: 'shareSuccess',
	subCooldownCount: 120,
	trace: true,
};