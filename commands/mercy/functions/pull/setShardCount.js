const { db } = require('../../../../database/database');
const { newTimestamp } = require('../../../../Ιndex/utilities');


async function setShardCount(account, shard, count) {
	try {

		const timestamp = newTimestamp('m/d');

		const shardTypes = (shard === 'primal') ? ['primal.legendary', 'primal.mythical'] : [shard];
		const shardData = (shard === 'primal') ? account.mercy[shard].mythical : account.mercy[shard];
		const lastAdded = isSameDay(shardData.last, timestamp) ? shardData.lastAdded + count : count;

		for (const shardType of shardTypes) {

			let totalCount;
			let totalPulledCount;
			if (shard === 'primal') {
				const split = shardType.split('.');
				totalCount = account.mercy[split[0]][split[1]].totalCount + count;
				totalPulledCount = account.mercy[split[0]][split[1]].count + count;
			}
			else {
				totalCount = account.mercy[shard].totalCount + count;
				totalPulledCount = account.mercy[shard].count + count;
			}

			const updateShard = 'UPDATE mercy_tracker_data SET count = ?, totalCount = ?, lastAdded = ?, lastPulled = ? WHERE id = ? AND name = ? AND shard = ?';

			const updateValues = [totalPulledCount, totalCount, lastAdded, timestamp, account.id, account.name, shardType];
			await db.run(updateShard, updateValues);
		}
	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	setShardCount,
};

function isSameDay(timestamp1, timestamp2) {

	const isSame = (timestamp1 === timestamp2) ? true : false;
	return isSame;

}