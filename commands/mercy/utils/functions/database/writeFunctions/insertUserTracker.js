// Database
const { db } = require('../../../../../../database/utils/databaseIndex');


async function insertUserTracker(userId, username, account, shard, number) {

	try {
		// Designate shard types
		const shardTypes = ['ancient', 'void', 'primal', 'sacred'];

		// Loop through types - if primal insert mythical/legendary counts
		for (const shardType of shardTypes) {
			if (shardType === 'primal') {
				await db.run('INSERT INTO mercy_tracker(user_id, username, account, shard, count, legendary_count, mythical_count) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, username, account, shardType, 0, shardType === shard ? number : 0, shardType === shard ? number : 0]);
			}
			else {
				await db.run('INSERT INTO mercy_tracker(user_id, username, account, shard, count) VALUES (?, ?, ?, ?, ?)', [userId, username, account, shardType, shardType === shard ? number : 0]);
			}
		}
	}
	catch (error) {
		console.log('Error detected in InsertUserTracker');
		throw error;
	}
}

module.exports = {
	insertUserTracker,
};