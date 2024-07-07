const { EmbedBuilder } = require('discord.js');
const { shardTypes, shardNameLengths } = require('../textMaps');
const { Embed } = require('../mercy/embed');

async function listChampions(interaction, account) {

	try {

		let output = '';
		let shardArray = [];
		const share = interaction.options.getString('share');
		const shardInput = interaction.options.getString('shard');

		shardInput ? shardArray.push(shardInput) : shardArray = shardTypes;

		shardArray.forEach(shard => {

			let champions = '';

			const [primal, type] = shard.split('.');
			const shardData = shard.startsWith('primal.') && type ? account.mercy[primal][type] : account.mercy[shard];

			shardData.lastChampion.forEach(champion => {
				champions += `${Embed.truncate({ string: `${Embed.truncate({ string: `${champion.monthDay}`, limit: 8, pad: true, alignment: 'center' })}│${Embed.truncate({ string: ` ${champion.champion}`, limit: 36, pad: true })}│${Embed.truncate({ string: `${champion.lastCount}`, limit: 7, pad: true, alignment: 'right' })}`, limit: 54, pad: true, style: ['block_code'] })}`;
			});
			if (shardData.lastChampion.length > 0) {
				output += `${Embed.truncate({ string: `  ${shardNameLengths[shard]}  `, limit: 54, pad: true, add: '-', alignment: 'center', style: ['block_code'] })}`;
			}
			output += champions;
		});

		if (output === '') output = `${Embed.truncate({ string: 'No champions pulled yet - bummer', limit: 54, pad: true, alignment: 'center', style: ['block_code'] })}`;

		const listChampionsEmbed = new EmbedBuilder()
			.setColor('#ED8223')
			.addFields({ name: ' ', value: `${Embed.truncate({ string: '  date  │              Champion              │  count', limit: 54, pad: true, style: ['block_code'] })}` });
		listChampionsEmbed.addFields({ name: ' ', value: output }),

		await interaction.editReply({
			embeds: [listChampionsEmbed],
			ephemeral: !share,
		});

		if (share) setTimeout(() => { interaction.deleteReply(); }, 300000);

	}
	catch (error) {
		console.log(error);
	}

}

module.exports = {
	listChampions,
}