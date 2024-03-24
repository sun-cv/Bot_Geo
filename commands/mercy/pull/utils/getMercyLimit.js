const { mercyConditions } = require('../../mercyIndex');

function getMercyLimit(shard) {
	if (shard in mercyConditions) {
		let conditions = mercyConditions[shard];
		if (shard === 'primal') {
			conditions = conditions['mythical'];
		}
		const start = conditions.start;
		const base = conditions.base / 100;
		const increase = conditions.increase / 100;
		const limit = start + Math.ceil((1 - base) / increase);
		return limit;
	}
	return Infinity;
}

module.exports = {
	getMercyLimit,
	ignoreLoading: true,
};