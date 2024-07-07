const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { getUserId, sendFollowUpDelete } = require('../../../utils/index');
const { initializeMercy, getShardCount, mercyConditions, shardIdentifiers, identifierEmojis, userAccountExists } = require('../mercyIndex');
const { autocompleteUserAccounts } = require('../utils/functions/userAutoComplete');


async function mercyCommand(interaction = new CommandInteraction(), log) {

	await log.initiateCommand({ name: 'mercy', category: 'mercy tracker', role: 'Mercy' });

	let output;
	let result;

	const userId = log.member.id;
	const shareMercy = interaction.options.getString('share') === 'true';

	try {

		// ensure Mercy tracker exists, if not - Add
		await initializeMercy(interaction);

		// ensure user account exists, if not - return
		const userAccount = await userAccountExists (interaction, log);
		if (!userAccount) {
			log.returnCommand('denied', 'account does not exist');
			return;
		}

		/**
	 	*  main command logic
	 	*/

		// set output
		output = `__**<@${interaction.user.id}>'s ${userAccount} Mercy:**__\n`;

		// cycle shard identifiers
		for (const identifier of shardIdentifiers) {
		// get shard count
			const countValue = await getShardCount(userId, userAccount, identifier)
			// primal - import mythicalResult, legendaryResult
			if (identifier === 'primal') {
				// mercy condition calculation
				const legendaryResult = mercyConditions[identifier].legendary.base + Math.max(countValue.legendary_count - mercyConditions[identifier].legendary.start, 0) * mercyConditions[identifier].legendary.increase;
				const mythicalResult = mercyConditions[identifier].mythical.base + Math.max(countValue.mythical_count - mercyConditions[identifier].mythical.start, 0) * mercyConditions[identifier].mythical.increase;
				// mercy % calculation
				result = `${mythicalResult.toFixed(1)}% (Legendary: ${countValue.legendary_count} - ${legendaryResult.toFixed(1)}%)`;
				// set Primal output
				output += `${identifierEmojis[identifier]} ${countValue.mythical_count} - ${result}\n`;
			}
			// ancient, Void, Sacred
			else {
				const condition = mercyConditions[identifier];
				result = `${(condition.base + Math.max(countValue.count - condition.start, 0) * condition.increase).toFixed(1)}%`;
				// set ancient, void, Sacred output
				output += `${identifierEmojis[identifier]} ${countValue.count} - ${result}\n`;
			}
		}

		sendFollowUpDelete(interaction, output, !shareMercy, 15000);
		return;
	}
	catch (error) {
		log.errorHandling(error);
	}
	finally {
		log.finalizeCommand(output);
	}
}

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('mercy')
// 		.setDescription('Check your mercy count')
// 		.addStringOption(option =>
// 			option.setName('account')
// 				.setDescription('Alt account')
// 				.setAutocomplete(true))
// 		.addStringOption(option =>
// 			option.setName('share')
// 				.setDescription('Share your mercy count')
// 				.addChoices(
// 					{ name: 'true', value: 'true' })),
// 	// Autocomplete interaction handler
// 	async autocomplete(interaction) {
// 		const userId = getUserId(interaction);
// 		const focusedValue = interaction.options.getFocused();
// 		const choices = autocompleteUserAccounts[userId] || [];
// 		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
// 		await interaction.respond(
// 			filtered.map(choice => ({ name: choice, value: choice })),
// 		);
// 	},
// 	execute: mercyCommand,
// 	command: true,
// 	defer: true,
// 	moderator: false,
// 	maintenance: false,
// 	ephemeral: true,
// 	trace: true,
// 	cooldownCount: 0,
// 	subCommand: 'shareMercy',
// 	subCooldownCount: 120,
// };