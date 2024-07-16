const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { initializeUserMercy } = require('./functions/account/initializeUserMercy');
const { loadMercyData } = require('./functions/account/loadMercyData');
const { shardMercyConditions, shardEmojis } = require('./functions/textMaps');
const { sendFollowUpDelete } = require('../../Ιndex/utilities');


async function successCommand(interaction = new CommandInteraction()) {

	try {

		const account = await initializeUserMercy(interaction);
		if (!account) return;

		await loadMercyData(interaction, account);

		const number = interaction.options.getInteger('number');
		const shard = interaction.options.getString('shard');
		const doubleEvent = interaction.options.getString('2x');
		const startNumber = interaction.options.getInteger('count');
		const shareSuccess = interaction.options.getString('share') === 'true';

		let count;
		let currentCount;
		let initialCount;
		let adjustedMercyConditions;

		switch (shard) {
		case 'primal.legendary': {

			count = account.mercy.primal.legendary.count;
			currentCount = count ? count : 0;
			initialCount = currentCount;

			adjustedMercyConditions = shardMercyConditions.primal.legendary;
			break;
		}
		case 'primal.mythical': {

			count = account.mercy.primal.mythical.count;
			currentCount = count ? count : 0;
			initialCount = currentCount;
			adjustedMercyConditions = shardMercyConditions.primal.mythical;

			break;
		}
		default: {

			count = account.mercy[shard].count;
			currentCount = count ? count : 0;
			initialCount = currentCount;

			adjustedMercyConditions = shardMercyConditions[shard];
			break;
		}
		}

		if (startNumber !== null) {
			currentCount = startNumber;
			initialCount = startNumber;
		}

		let totalFailureChance = 1;

		for (let i = 0; i < number; i++) {
			let failureChance;
			let baseChance = adjustedMercyConditions.base;
			if (doubleEvent === 'yes') baseChance *= 2;
			if (currentCount < adjustedMercyConditions.start) { failureChance = 1 - baseChance / 100; }
			else {
				failureChance = 1 - (baseChance + (currentCount - adjustedMercyConditions.start + 1) * adjustedMercyConditions.increase) / 100;
				if (failureChance <= 0) failureChance = 0.01;
			}
			totalFailureChance *= failureChance;
			currentCount++;
		}

		let totalSuccessChancePercent = (1 - totalFailureChance) * 100;

		if (totalSuccessChancePercent > 100) {
			totalSuccessChancePercent = 100;
		}

		const championType = (shard === 'primal.mythical') ? 'mythical champion' : 'legendary champions';
		const shardName = (shard === 'primal.mythical' || shard === 'primal.legendary') ? 'primal' : shard;

		const output = `You've pulled ${initialCount} ${shardEmojis[shard]} shards to date <@${interaction.user.id}>.\n \nThe cumulative success chance of pulling a ${championType} from ${number} ${shardName} shards is approximately ${totalSuccessChancePercent.toFixed(2)}%.`;

		// Send the output
		sendFollowUpDelete(interaction, output, !shareSuccess, 15000);
		return;

	}
	catch (error) {
		console.log(error);
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
					{ name: 'primal legendary', value: 'primal.legendary' },
					{ name: 'primal mythical', value: 'primal.mythical' },
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

	execute: successCommand,
	command: true,
	defer: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	cooldown: 0,
	subCommand: 'shareSuccess',
	subCooldown: 120,
	trace: true,
};