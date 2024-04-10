const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { db } = require('../../../database/utils/databaseIndex');
const { getUserId } = require('../../../utils/index');
const { identifierEmojis, initializeMercy, setUser, userAccountExists } = require('../mercyIndex');
const { autocompleteUserAccounts } = require('../utils/functions/userAutoComplete');


async function resetMercyCommand(interaction = new CommandInteraction(), log) {

	await log.initiateCommand({ name: 'pull', category: 'mercy tracker', role: 'Mercy' });

	const userId = log.member.id;
	const shard = interaction.options.getString('shard');
	const count = 0;
	let emoji;

	try {

		// ensure Mercy tracker exists, if not - Add
		await initializeMercy(interaction);

		// ensure user account exists, if not - return
		const userAccount = await userAccountExists(interaction, log);
		if (!userAccount) {
			log.returnCommand('denied', 'account does not exist');
			return;
		}


		if (shard === 'all') {

			// reset the count for all shard types
			const shardcycle = ['ancient', 'void', 'primal', 'sacred'];
			// cycle all shards
			shardcycle.forEach(shardType => { setUser(userId, userAccount, shardType, count); });

			interaction.followUp({ content: 'You\'ve successfully reset all mercy counts. Stay awesome!', ephemeral: true });
			return;
		}
		else {

			// Reset the count for the specified shard type
			if (shard === 'primal_legendary' || shard === 'primal_mythical') {

				const column = shard === 'primal_legendary' ? 'legendary_count' : 'mythical_count';
				// reset Primal count
				await db.run(`UPDATE mercy_tracker SET ${column} = 0 WHERE user_id = ? AND account = ? AND shard = 'primal'`, [userId, userAccount]);

			}
			else {

				// reset Ancient, Void, Sacred
				setUser(userId, userAccount, shard, count);
			}

			if (shard === 'primal_legendary' || shard === 'primal_mythical') {
				emoji = identifierEmojis['primal'];
			}
			else {
				emoji = identifierEmojis[shard];
			}

			interaction.followUp({ content: `You've successfully reset your ${emoji} shards ${userAccount && userAccount !== 'main' ? `for account: ${userAccount} - Congratulations on your pull!` : ' - Congratulations on your pull!'}`, ephemeral: true });
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
	deferReply: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	trace: true,
};