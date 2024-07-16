const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { initializeUserMercy } = require('./functions/account/initializeUserMercy');
const { createChampionLog } = require('./functions/reset/createChampionLog');
const { resetShardCount } = require('./functions/reset/resetShardCount');
const { shardEmojis } = require('./functions/textMaps');
const { championListAutocomplete } = require('../autocomplete/championAutocomplete');


async function resetMercyCommand(interaction = new CommandInteraction()) {
	try {

		const account = await initializeUserMercy(interaction);
		if (!account) return;

		await createChampionLog(interaction, account);

		await resetShardCount(interaction, account);

		const shard = interaction.options.getString('shard');
		interaction.followUp({ content: `You've successfully reset your ${shardEmojis[shard]} shards ${account.account && account.account !== 'main' ? `for account: ${account.account} - Congratulations on your pull!` : ' - Congratulations on your pull!'}`, ephemeral: true });

	}
	catch (error) {
		console.log(error);
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
					{ name: 'primal legendary', value: 'primal.legendary' },
					{ name: 'primal mythical', value: 'primal.mythical' },
					{ name: 'sacred', value: 'sacred' },
				))
		.addStringOption(option =>
			option.setName('champion')
				.setDescription('What champion did you pull?')
				.setRequired(true)
				.setAutocomplete(true))
		.addIntegerOption(option =>
			option.setName('count')
				.setDescription('Add to count for tracking purposes')
				.setRequired(false)
				.setMinValue(0)
				.setMaxValue(999))
		.addStringOption(option =>
			option.setName('account')
				.setDescription('Alt account')
				.setAutocomplete(true)),

	// Autocomplete interaction handler
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		const choices = championListAutocomplete || [];
		const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue)).slice(0, 25);
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	execute: resetMercyCommand,
	command: true,
	defer: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	trace: true,
};