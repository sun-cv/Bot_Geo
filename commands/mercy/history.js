const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { initializeUserMercy } = require('./functions/account/initializeUserMercy');
const { listChampions } = require('./functions/history/listChampions');


async function historyCommand(interaction = new CommandInteraction(), log) {

	await log.initiateCommand({ name: 'mercy', category: 'mercy tracker', role: 'Mercy' });

	try {

		const account = await initializeUserMercy(interaction);
		if (!account) return;

		await listChampions(interaction, account);

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
		.setName('history')
		.setDescription('Check your mercy history')
		.addStringOption(option =>
			option.setName('shard')
				.setDescription('Shard type to list')
				.setRequired(false)
				.addChoices(
					{ name: 'ancient', value: 'ancient' },
					{ name: 'void', value: 'void' },
					{ name: 'primal', value: 'primal' },
					{ name: 'sacred', value: 'sacred' },
				))
		.addStringOption(option =>
			option.setName('account')
				.setDescription('Alt account')
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('share')
				.setDescription('Share your mercy history')
				.addChoices(
					{ name: 'true', value: 'true' })),

	execute: historyCommand,
	command: true,
	defer: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	trace: true,
	cooldownCount: 0,
	subCommand: 'shareMercy',
	subCooldownCount: 120,
};