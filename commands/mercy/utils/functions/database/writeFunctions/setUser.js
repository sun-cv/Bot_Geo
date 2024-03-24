const { db } = require('../../../../../../database/database');

async function setUser(userId, userAccount, shard, count) {
	try {
		if (shard === 'primal') {
			await db.run('UPDATE mercy_tracker SET mythical_count = ?, legendary_count = ? WHERE user_id = ? AND account = ? AND shard = ?', [count, count, userId, userAccount, shard]);
		}
		else {
			await db.run('UPDATE mercy_tracker SET count = ? WHERE user_id = ? AND account = ? AND shard = ?', [count, userId, userAccount, shard]);
		}
	}
	catch (error) {
		console.log('Error detected in setUser');
		throw error;
	}
}

module.exports = {
	setUser,
	ignoreLoading: true,
};