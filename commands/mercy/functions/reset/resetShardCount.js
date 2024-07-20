const { db } = require('../../../../database/database');
const { newTimestamp } = require('../../../../Ιndex/utilities');


async function resetShardCount(interaction, account) {
	try {

		const shard = interaction.options.getString('shard');

		const lastReset = newTimestamp('m/d');

		const updateShard = 'UPDATE mercy_tracker_data SET count = ?, lastReset = ? WHERE id = ? AND name = ? AND shard = ?';
		const updateValues = [0, lastReset, account.id, account.name, shard];
		await db.run(updateShard, updateValues);

	}

	catch (error) {
		console.log(error);
	}
}

module.exports = {
	resetShardCount,
};

