const { db } = require('../../../../database/database');
const { shardTypes, shardMercyConditions } = require('../textMaps');

async function loadMercyData(interaction, account) {

	try {

		const mercy = { primal: {} };

		const mercyData = await db.all('SELECT * FROM mercy_tracker_data WHERE id = ? AND name = ?', [interaction.member.user.id, account.name]);

		for (const shard of shardTypes) {

			const shardData = mercyData.find(data => data.shard === shard);
			const condition = shardMercyConditions[shard];

			if (shard.startsWith('primal.')) {

				const [primal, type] = shard.split('.');

				mercy[primal][type] = shardData;
				mercy[primal][type].chance = `${(condition.base + Math.max(mercy[primal][type].count - condition.start, 0) * condition.increase).toFixed(1)}%`;
			}
			else {
				mercy[shard] = shardData;
				mercy[shard].chance = `${(condition.base + Math.max(mercy[shard].count - condition.start, 0) * condition.increase).toFixed(1)}%`;
			}

		}

		account.mercy = mercy;

	}
	catch (error) {
		console.log(error);
	}

}

module.exports = {
	loadMercyData,
};