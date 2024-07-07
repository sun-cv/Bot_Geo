const { db } = require('../../../../../../database/utils/databaseIndex');


async function getShardCount(userId, userAccount, shard, column) {

	try {

		let countValue;

		if (column) {
		// Pull shard count designated row
			countValue = await db.get(`SELECT ${column} FROM mercy_tracker WHERE user_id = ? AND account = ? AND shard = ?`, [userId, userAccount, shard]);
		}
		else {
		// Pull shard count
			countValue = await db.get('SELECT count, mythical_count, legendary_count FROM mercy_tracker WHERE user_id = ? AND account = ? AND shard = ?', [userId, userAccount, shard]);
		}
		return countValue;
	}
	catch (error) {
		console.log('Error detected in getShardCount');
		throw error;
	}
}

module.exports = {
	getShardCount,
	ignoreLoading: true,
};