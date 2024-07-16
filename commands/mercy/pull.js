const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { initializeUserMercy } = require('./functions/account/initializeUserMercy');
const { getMercyLimit } = require('./functions/mercy/getMercyLimit');
const { setShardCount } = require('./functions/pull/setShardCount');
const { shardEmojis } = require('./functions/textMaps');
const { sendFollowUpDelete } = require('../../Ιndex/utilities');


async function pullCommand(interaction = new CommandInteraction()) {
	try {

		const account = await initializeUserMercy(interaction);
		if (!account) return;

		const count = interaction.options.getInteger('count');
		const shard = interaction.options.getString('shard');

		const currentCount = (shard === 'primal') ? account.mercy[shard].mythical.count : account.mercy[shard].count;
		const totalPulledCount = currentCount + count;

		const mercyLimit = await getMercyLimit(shard);

		let output = `<@${interaction.user.id}> pulled ${count} ${shardEmojis[shard]}`;

		if (totalPulledCount >= mercyLimit) {

			const exceeded = totalPulledCount - mercyLimit;
			output = output + `\n\n You've exceeded your ${shard} mercy count by ${exceeded}. It has been reset for you`;

			await setShardCount(account, shard, 0);
			await sendFollowUpDelete(interaction, output, false, 10000);
			return;
		}
		else {

			await setShardCount(account, shard, count);
			await sendFollowUpDelete(interaction, output, false, 10000);
			return;
		}
	}
	catch (error) {
		console.log(error);
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

	execute: pullCommand,
	command: true,
	defer: true,
	moderator: false,
	maintenance: false,
	ephemeral: false,
	trace: true,


};