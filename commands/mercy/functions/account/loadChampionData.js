const { db } = require('../../../../database/database');
const { shardTypes } = require('../textMaps');

async function loadChampionData(interaction, account) {

	try {

		const championData = await db.all('SELECT * FROM mercy_tracker_champions WHERE id = ? AND name = ?', [interaction.member.user.id, account.name]);

		let lastChampion;

		for (const shard of shardTypes) {

			if (shard.startsWith('primal.')) {
				const primalSplit = shard.split('.');
				const primal = primalSplit[0];
				const type = primalSplit[1];

				lastChampion = account.mercy[primal][type].lastChampion = [];
			}
			else {
				lastChampion = account.mercy[shard].lastChampion = [];
			}

			for (const champion of championData) {

				if (champion.shard === shard) {
					lastChampion.push(champion);
				}
			}
			lastChampion.sort((a, b) => a.timestamp - b.timestamp);
		}
	}
	catch (error) {
		console.log(error);
	}

}

module.exports = {
	loadChampionData,
}