const { db } = require('../../../../../../database/database');


async function getCurrentPulls(userId, userAccount, shard) {
	try {
		const currentPulls = await db.get('SELECT count, mythical_count FROM mercy_tracker WHERE user_id = ? AND account = ? AND shard = ?', [userId, userAccount, shard]);

		return currentPulls;
	}
	catch (error) {
		console.log('Error detected in getCurrentPulls');
		throw error;
	}
}

module.exports = {
	getCurrentPulls,
	ignoreLoading: true,
};